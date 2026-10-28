// Adapter interface for future real e-commerce catalog integrations.
// Current implementation uses manual configuration only.

export interface CatalogProduct {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  price?: number;
}

export interface CatalogAdapter {
  /** Returns complementary products for the given product id, or store-wide defaults. */
  getComplementaryProducts(storeId: string, productId?: string): Promise<CatalogProduct[]>;
  /** Health check for the integration. */
  isConfigured(storeId: string): Promise<boolean>;
}

export class ManualCatalogAdapter implements CatalogAdapter {
  constructor(private getProducts: (storeId: string) => Promise<CatalogProduct[]>) {}

  async getComplementaryProducts(storeId: string): Promise<CatalogProduct[]> {
    return this.getProducts(storeId);
  }

  async isConfigured(): Promise<boolean> {
    return true;
  }
}