# Yapılan Değişiklikler

1. **Ayrı HTML Sayfalarına Bölme (Multi-Page):**
   - Site tek sayfa yapısından çıkarılarak bağımsız HTML dosyalarına ayrıldı:
     - `index.html`: Giriş, tam mekanik saat kalibresi karakalem teknik kesit çizimi, rehber özet kartları ve mekanik saatin 5 organı.
     - `mekanizmalar.html`: Seiko NH, ETA, Ronda ve Miyota kalibreleri, arama, 4 kademeli filtreleme ve detay pencereleri (popover).
     - `komplikasyonlar.html`: Tourbillon, Chronograph, Flyback, Moonphase ve Perpetual Calendar kartları, arama ve teknik açıklamalar.
     - `bezeller.html`: Dalgıç, Takimetre ve GMT bezelleri için kullanım kılavuzları, matematiksel formüller ve güvenlik ipuçları.
   - Üst gezinme çubuğu (`.topbar`) ve alt gezinme (`.site-footer`) tüm sayfalarda aktif sayfa vurgusu (`.active`, `aria-current="page"`) ile bağlandı.

2. **Tipografi ve Font Değişimi (Roboto):**
   - Video oyunu havası veren retro/geometrik fontlar (Space Grotesk, DM Sans) kaldırıldı.
   - Tüm başlıklar, gövde metinleri ve etiketler profesyonel ve okunaklı **Roboto** ve teknik veriler için **Roboto Mono** ile değiştirildi.
   - Harf aralıkları ve satır yükseklikleri saatçilik yayınlarına uygun biçimde dengelendi.

3. **Tam Mekanik Saat Kalibresi Karakalem Çizimi ve İnteraktif Simülasyonu:**
   - Sadece zemberek değil, saatin içindeki **tüm mekanik organlar** bir arada çalışan bir kalibre olarak çizildi:
     - **Zemberek ve Tulumba (Barillet):** 72 dişli tulumba gövdesi, içindeki açık kesitte görünen spiral çelik zemberek şeridi ve cırcır çarkı.
     - **Çark Grubu (Rouage):** Merkez çarkı (64 diş), ara çark (60 diş), saniye çarkı (60 diş, 1 RPM) pirinç ve çelik tonlarında gerçeğe uygun dişli profilleriyle.
     - **Eşapman Çarkı & Maşası (Échappement):** 15 tırnaklı özel kulüp dişli ve 2 adet sentetik yakut taşa (pallets) sahip çalışan eşapman maşası.
     - **Balans Çarkı ve Pandül Yayı (Balancier & Spiral):** Altın Glucydur balans çarkı, çevre ayar vidaları, salınan mavi kılcal pandül yayı ve merkezde Incabloc şok koruma yayı (lir yay).
     - **Ana Plaka ve Köprüler:** Karakalem dairesel finiş (perlage) dokusu, köprü pahları, mavi çelik vidalar ve yakut yataklar (jewels).
   - **Gerçek Zamanlı Senkron Fizik (28.800 BPH / 4 Hz):** Balans çarkı saniyede 8 vuruş yaparken eşapman maşası kilitlenip serbest kalır ve çark treni torku aktarır.
   - **Kontroller:** "Kur" (zembereği sarar), "Ağır Çekim" (0.25x hızda dişli temasını izletir), "Canlı Mekanizma" (gerçek çalışma hızı) ve dokunmatik/fare ile manuel kurma.
   - **1:1 Gerçek Boyut:** Standart saat kalibre çapı olan Ø 27.4 mm referans halkası eklendi.

4. **Kartların Boyutlandırılması (Daha Uzun Kartlar):**
   - Tüm kartların dikey boyu uzatıldı (`min-height: 380px` – `420px`).
   - Kartlara alt başlıklar, detaylı mekanik açıklamalar, teknik özellik etiketleri (taş sayısı, BPH, hacking, şok koruma) ve görsel boşluklar eklendi.
