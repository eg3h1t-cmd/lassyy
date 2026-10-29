-- Expand the ala-carte catalog to 10 modules with current TL prices.
-- Safe to run after 0010 (upsert by id).

insert into public.modules (id, slug, name, price, description)
values
  ('sans_carki', 'sans_carki', 'Şans Çarkı', 1750.00, 'Sunucu taraflı kupon korumalı ödül çarkı.'),
  ('wp_sepet_hatirlatma', 'wp_sepet_hatirlatma', 'WhatsApp Sepet Hatırlatma', 1250.00, 'Terk edilen sepetler için WhatsApp hatırlatma mesajları.'),
  ('wp_kampanya_toplu', 'wp_kampanya_toplu', 'WhatsApp Kampanya Toplu Bildirim', 1250.00, 'Kampanya duyurularını WhatsApp üzerinden toplu gönderin.'),
  ('wp_kargo_takip', 'wp_kargo_takip', 'WhatsApp Kargo Takip', 1250.00, 'Kargo durum güncellemelerini WhatsApp ile iletin.'),
  ('akilli_sepet_onerisi', 'akilli_sepet_onerisi', 'Akıllı Sepet Önerisi', 1000.00, 'Sepet tutarına göre dinamik ürün ve kargo avantajları.'),
  ('akilli_beden', 'akilli_beden', 'Akıllı Beden Asistanı', 2000.00, 'Müşterilere doğru bedeni öneren akıllı asistan.'),
  ('cikis_niyetli_popup', 'cikis_niyetli_popup', 'Çıkış Niyetli Pop-uplar', 1000.00, 'Kullanıcı siteden ayrılmak üzereyken tetiklenen akıllı teklifler.'),
  ('analitik', 'analitik', 'Analitik', 1000.00, 'Gerçek zamanlı ve mağaza odaklı metrik takibi.'),
  ('geri_sayim_kampanyalari', 'geri_sayim_kampanyalari', 'Geri Sayım Kampanyaları', 1000.00, 'Güvenli zaman damgalı süre sınırlı kampanyalar.'),
  ('urun_onerileri', 'urun_onerileri', 'Ürün Önerileri', 1000.00, 'Gösterim ve tıklama takipli tamamlayıcı ürün setleri.')
on conflict (id) do update
set slug = excluded.slug,
    name = excluded.name,
    price = excluded.price,
    description = excluded.description;