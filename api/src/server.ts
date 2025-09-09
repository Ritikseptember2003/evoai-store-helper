import express, { Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import products from './data/products.json';
import orders from './data/orders.json';
import { addToCartSchema, orderStatusSchema } from './services/validation';
import { auditLogger } from './middleware/auditLogger';

// --- In-Memory Data Store ---
const app = express();
const PORT = process.env.PORT || 3001;
let cart: { [productId: string]: { qty: number } } = {};
const productMap = new Map(products.map(p => [p.id, p]));

const metrics = {
  searches: 0,
  addsToCart: 0,
  orderLookups: 0,
};

app.use(cors());
app.use(express.json());
app.use(auditLogger);

const orderStatusLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests to this endpoint, please try again after 15 minutes.' }
});

// --- Routes ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// NEW: Metrics Endpoint
app.get('/metrics', (req: Request, res: Response) => {
  res.status(200).json(metrics);
});

app.get('/search', (req: Request, res: Response) => {
  metrics.searches++; 
  const query = (req.query.q as string)?.toLowerCase() || '';
  const minPrice = parseInt(req.query.minPrice as string);
  const maxPrice = parseInt(req.query.maxPrice as string);

  if (!query) {
    return res.status(400).json({ error: 'Search query "q" is required.' });
  }

  const results = products.filter(p => {
    const matchesQuery = p.title.toLowerCase().includes(query) ||
                         p.tags.some(tag => tag.toLowerCase().includes(query));
    
    const matchesMinPrice = !isNaN(minPrice) ? p.price >= minPrice : true;
    const matchesMaxPrice = !isNaN(maxPrice) ? p.price <= maxPrice : true;

    return matchesQuery && matchesMinPrice && matchesMaxPrice;
  });

  res.status(200).json(results);
});

app.post('/cart/add', (req: Request, res: Response) => {
  metrics.addsToCart++; // Increment cart metric
  const validation = addToCartSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors });
  }
  
  const { productId, qty } = validation.data;
  if (!productMap.has(productId)) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  cart[productId] = { qty: (cart[productId]?.qty || 0) + qty };
  
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  res.status(200).json({ cart, totalItems });
});

app.post('/order/status', orderStatusLimiter, (req: Request, res: Response) => {
  metrics.orderLookups++; // Increment lookup metric
  const validation = orderStatusSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors });
  }
  
  const { orderId, email } = validation.data;
  const order = orders.find(o => o.orderId === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  if (order.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(401).json({ error: 'Unauthorized. Invalid credentials.' });
  }

  const itemsWithDetails = order.items.map(item => {
      const productDetails = productMap.get(item.id);
      return { ...item, title: productDetails?.title || 'Unknown Product' };
  });

  res.status(200).json({ ...order, items: itemsWithDetails });
});

// --- Server Start ---
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
  });
}

export default app;