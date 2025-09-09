import request from 'supertest';
import app from '../server';

describe('EvoAI API', () => {
  
  describe('GET /search', () => {
    it('should find products by title', async () => {
      const res = await request(app).get('/search?q=hoodie');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('Charcoal Hoodie');
    });

    it('should find products by tag', async () => {
      const res = await request(app).get('/search?q=grooming');
      expect(res.statusCode).toEqual(200);
      expect(res.body[0].tags).toContain('grooming');
    });

    it('should return 400 if query is missing', async () => {
      const res = await request(app).get('/search');
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /order/status', () => {
    it('should return order status with correct credentials', async () => {
      const res = await request(app)
        .post('/order/status')
        .send({ orderId: 'ORD-1001', email: 'alice@example.com' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('Shipped');
    });

    it('should return 401 Unauthorized with incorrect email', async () => {
      const res = await request(app)
        .post('/order/status')
        .send({ orderId: 'ORD-1001', email: 'wrong@example.com' });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.error).toContain('Unauthorized');
    });

    it('should return 404 Not Found for a non-existent order ID', async () => {
        const res = await request(app)
          .post('/order/status')
          .send({ orderId: 'ORD-9999', email: 'alice@example.com' });
        
        expect(res.statusCode).toEqual(404);
    });

    it('should return 400 Bad Request for invalid input format', async () => {
        const res = await request(app)
          .post('/order/status')
          .send({ orderId: '1001', email: 'not-an-email' });
        
        expect(res.statusCode).toEqual(400);
    });
  });
});