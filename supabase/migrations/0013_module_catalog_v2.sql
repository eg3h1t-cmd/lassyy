-- Final ala-carte catalog: 7 modules, no subscriptions, no recommendations/analytics.
-- WARNING: this removes modules that are no longer sold and their purchase/config rows.

-- Map existing campaign/module references where the SKU was renamed.
update public.campaigns set module_id = 'sans_carki' where module_id = 'discount-spin-wheel';
update public.campaigns set module_id = 'geri_sayim_kampanyalari' where module_id = 'countdown-campaigns';

-- Remove purchases/config for retired modules before deleting the catalog rows.
delete from public.tenant_modules
where module_id not in (
  'sans_carki',
  'wp_sepet_hatirlatma',
  'wp_kampanya_toplu',
  'wp_kargo_takip',
  'akilli_beden',
  'cikis_niyetli_popup',
  'geri_sayim_kampanyalari'
);

delete from public.store_modules
where module_id not in (
  'sans_carki',
  'wp_sepet_hatirlatma',
  'wp_kampanya_toplu',
  'wp_kargo_takip',
  'akilli_beden',
  'cikis_niyetli_popup',
  'geri_sayim_kampanyalari'
);

delete from public.modules
where id not in (
  'sans_carki',
  'wp_sepet_hatirlatma',
  'wp_kampanya_toplu',
  'wp_kargo_takip',
  'akilli_beden',
  'cikis_niyetli_popup',
  'geri_sayim_kampanyalari'
);

insert into public.modules (id, slug, name, price, description, channel)
values
  ('sans_carki', 'sans_carki', 'Şans Çarkı', 1750.00, 'Etkileşimli İndirim Çarkı', 'web'),
  ('wp_sepet_hatirlatma', 'wp_sepet_hatirlatma', 'WhatsApp Sepet Hatırlatma', 1250.00, 'Otomatik Terkedilmiş Sepet Bildirimi', 'whatsapp'),
  ('wp_kampanya_toplu', 'wp_kampanya_toplu', 'WhatsApp Kampanya Toplu Bildirim', 1250.00, 'Toplu Duyuru ve Kampanya Gönderimi', 'whatsapp'),
  ('wp_kargo_takip', 'wp_kargo_takip', 'WhatsApp Kargo Takip', 1250.00, 'Anlık Kargo Durum Bilgilendirmesi', 'whatsapp'),
  ('akilli_beden', 'akilli_beden', 'Akıllı Beden Asistanı', 2000.00, 'Beden Öneri Asistanı', 'web'),
  ('cikis_niyetli_popup', 'cikis_niyetli_popup', 'Çıkış Niyetli Pop-uplar', 1000.00, 'Ziyaretçi Tutma Pop-up''ı', 'web'),
  ('geri_sayim_kampanyalari', 'geri_sayim_kampanyalari', 'Geri Sayım Kampanyaları', 1000.00, 'Sınırlı Süre Teklif Sayaçları', 'web')
on conflict (id) do update
set slug = excluded.slug,
    name = excluded.name,
    price = excluded.price,
    description = excluded.description,
    channel = excluded.channel;