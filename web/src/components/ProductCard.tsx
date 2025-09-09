interface Product {
  id: string;
  title: string;
  price: number;
  tags: string[];
}

export const ProductCard = ({ product }: { product: Product }) => (
  <div className="product-card">
    <div className="product-card-header">
      <span>{product.title}</span>
      <span className="product-card-price">${product.price}</span>
    </div>
    <div className="product-card-tags">
      {product.tags.map(tag => <span key={tag} className="tag-chip">{tag}</span>)}
    </div>
    <p className="helper-text">To add, type: <strong>add {product.id} x1</strong></p>
  </div>
);