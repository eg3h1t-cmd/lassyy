export const moduleLabels: Record<string, { name: string; description: string; route: string }> = {
  "discount-spin-wheel": {
    name: "Çarkıfelek İndirimi",
    description: "Sunucu taraflı kupon korumalı ödül çarkı.",
    route: "wheel",
  },
  "product-recommendations": {
    name: "Ürün Önerileri",
    description: "Gösterim ve tıklama takipli tamamlayıcı ürün setleri.",
    route: "recommendations",
  },
  "countdown-campaigns": {
    name: "Geri Sayım Kampanyaları",
    description: "Güvenli zaman damgalı süre sınırlı kampanyalar.",
    route: "countdown",
  },
  analytics: {
    name: "Analitik",
    description: "Gerçek zamanlı ve mağaza odaklı metrik takibi.",
    route: "analytics",
  },
};
