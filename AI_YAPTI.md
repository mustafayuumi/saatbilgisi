# Yapılan Değişiklikler

1. **Ayrı HTML Sayfalarına Bölme (Multi-Page):**
   - Site tek sayfa yapısından çıkarılarak bağımsız HTML dosyalarına ayrıldı:
     - `index.html`: Giriş, tam mekanik saat kalibresi karakalem teknik kesit çizimi ve rehber özet kartları.
     - `mekanizmalar.html`: Seiko NH, ETA, Ronda ve Miyota kalibreleri, arama, 4 kademeli filtreleme ve detay pencereleri (popover).
     - `komplikasyonlar.html`: Tourbillon, Chronograph, Flyback, Moonphase ve Perpetual Calendar kartları, arama ve teknik açıklamalar.
     - `bezeller.html`: Dalgıç, Takimetre ve GMT bezelleri için kullanım kılavuzları, matematiksel formüller ve güvenlik ipuçları.
   - Üst gezinme çubuğu (`.topbar`) ve alt gezinme (`.site-footer`) tüm sayfalarda aktif sayfa vurgusu (`.active`, `aria-current="page"`) ile bağlandı.

2. **Tipografi ve Font Değişimi (Roboto):**
   - Video oyunu havası veren retro fontlar kaldırıldı.
   - Başlıklar, gövde metinleri ve etiketler **Roboto** ve teknik veriler için **Roboto Mono** ile güncellendi.

3. **Tam Mekanik Saat Kalibresi & Boyut/Yerleşim Güncellemeleri:**
   - **Genişlik Oranı:** Anasayfadaki mekanizma alanı %50'den **%35** genişliğe çekildi (`grid-template-columns: 35% 65%`), metin ve içerik alanı ferahlatıldı.
   - **Büyütülmüş Mekanizma Çizimi:** Mekanizma çizim ölçeği artırılarak tuvali dolduracak şekilde daha büyük, net ve detaylı hale getirildi.
   - **Site Temasıyla Uyumlu Doku:** Mekanizmanın arkasındaki piksel/ızgara dokusu kaldırıldı; yerine sitenin mor ve lüks saatçilik kimliğiyle uyumlu dairesel teknik pergel yayları ve yumuşak radyal ışık geçişi (`#28203c` - `#151022`) yerleştirildi.
   - **Ağır Çekim Varsayılanı:** Mekanizma varsayılan olarak **Ağır Çekim (0.25x)** modunda başlar; dişli temasları ve eşapman kilitleri netçe izlenebilir.

4. **Bölüm Kaldırma & Footer Düzenlemesi:**
   - Anasayfadaki *"Bir Mekanik Saatin 5 Organı"* bölümü kaldırıldı.
   - Sitenin tüm sayfalarının altındaki footer alanına *"Bu site eğitim amaçlı hazırlanmış bir içeriktir."* notu eklendi.

5. **Kart Boyutları:**
   - Tüm kartlar daha uzun ve ferah dikey ölçülerle (`min-height: 380px` – `420px`) korundu.
