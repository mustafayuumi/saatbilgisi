# Yapılan Değişiklikler

1. **Ayrı HTML Sayfalarına Bölme (Multi-Page):**
   - Site tek sayfa yapısından çıkarılarak bağımsız HTML dosyalarına ayrıldı:
     - `index.html`: Giriş, sol bölgenin sınırlarına tam oturan kasa çerçevesi içinde çalışan mekanik kalibre, dönen kurma kolu ve rehber özet kartları.
     - `mekanizmalar.html`: Seiko NH, ETA, Ronda ve Miyota kalibreleri, arama, 4 kademeli filtreleme ve detay pencereleri (popover).
     - `komplikasyonlar.html`: Tourbillon, Chronograph, Flyback, Moonphase ve Perpetual Calendar kartları, arama ve teknik açıklamalar.
     - `bezeller.html`: Dalgıç, Takimetre ve GMT bezelleri için kullanım kılavuzları, matematiksel formüller ve güvenlik ipuçları.
   - Üst gezinme çubuğu (`.topbar`) ve alt gezinme (`.site-footer`) tüm sayfalarda aktif sayfa vurgusu (`.active`, `aria-current="page"`) ile bağlandı.

2. **Tipografi ve Font Değişimi (Roboto):**
   - Video oyunu havası veren retro fontlar kaldırıldı.
   - Başlıklar, gövde metinleri ve etiketler **Roboto** ve teknik veriler için **Roboto Mono** ile güncellendi.

3. **Mekanizmanın Görünürlük Sorununun Çözümü & Kenar Sınırlarına Tam Oturtulması:**
   - **Görünürlük ve Boyutlandırma Düzeltmesi:** CSS flex yapısında `height: 100%` çakışması ve JavaScript içindeki mükerrer değişken tanımlaması giderildi. Canvas'ın 0x0 piksele çökmesi engellendi; `ResizeObserver` ve güvenli yedek boyutlandırma eklendi.
   - **Sağ ve Sol Kenarların Bölge Sınırlarına Denk Gelmesi:** Saatin sol kenarı (9 yönündeki çelik kasa kenarı) bölgenin sol sınırına (`x = 4px`), sağ kenarı olan kurma kolu ucu ise bölgenin sağ sınırına (`x = width - 4px`) tam denk gelecek şekilde dinamik oranlama formülü (`scale = (width - 8) / 455`) uygulandı.
   - **Dönen Kurma Kolu (Winding Crown):** Saat 3 yönünde kasa koruma omuzları (crown guards), çelik gövde ve 3D tırtık çizgileri (knurling flutes) çizildi. **"Kur"** butonuna basıldığında kurma kolu hızlı ve akıcı bir şekilde döner, zembereği kurar ve güç rezervini artırır. Ayrıca fare/parmak ile sürüklendiğinde de kurma kolu elle çevrilebilir.
   - **Saf Mekanizma (Numaralandırmalar Kaldırıldı):** 1'den 5'e kadar numaralandırılmış tüm yazılar ve oklar kaldırıldı, sadece saf mekanik kalibre ve kasa çerçevesi görünür kılındı.
   - **Genişlik Oranı:** Anasayfada sol mekanizma bölümü %35 genişliktedir.
   - **Ağır Çekim Varsayılanı:** Mekanizma varsayılan olarak **Ağır Çekim (0.25x)** modunda açılır.

4. **Bölüm Kaldırma & Footer Düzenlemesi:**
   - Anasayfadaki *"Bir Mekanik Saatin 5 Organı"* bölümü kaldırıldı.
   - Sitenin tüm sayfalarının altındaki footer alanına *"Bu site eğitim amaçlı hazırlanmış bir içeriktir."* notu eklendi.

5. **Kart Boyutları:**
   - Tüm kartlar daha uzun ve ferah dikey ölçülerle (`min-height: 380px` – `420px`) korundu.

6. **Bezeller Sayfası Görselleri (Media Klasörü) & YouTube Video Embed Sistemi:**
   - **`media/` Klasörü ve Özel Görsel Desteği:**
     - Proje kök dizininde `media/` adında bir klasör oluşturuldu.
     - `bezeller.html` sayfasındaki yapay CSS çizimleri kaldırılarak doğrudan bu klasördeki görselleri yükleyecek yapıya geçildi:
       - `media/dalgic-bezel.jpg` (Dalgıç Bezeli)
       - `media/takimetre-bezel.jpg` (Takimetre Bezeli)
       - `media/gmt-bezel.jpg` (GMT Bezeli)
     - `media/` içerisine yüksek çözünürlüklü ve detaylı başlangıç görselleri ve rehber `README.md` dosyası eklendi. Kullanıcı kendi istediği görselleri bu klasöre aynı isimle atarak sayfayı dilediği gibi özelleştirebilir (JPG ve PNG yedekli fallback desteği mevcuttur).
   - **Tıklanabilir Önizleme & Detay Butonları:**
     - Bezel görsel önizlemesine tıklanabilir buton ve üzerinde cam efektli *"Kullanım Videosunu İzle ▶"* etiketi eklendi.
     - Kart metinlerinin altına da *"Kullanım videosunu & detayları incele ▶"* butonu yerleştirildi.
   - **YouTube Video Embed Modalları (Popover):**
     - Önizlemeye veya detay butonuna basıldığında ilgili bezelin nasıl kullanıldığını anlatan YouTube embed videosu ve pratik kullanım adımlarını içeren modal pencere açılır:
       - **Dalgıç Bezeli:** İstenen YouTube videosu (`https://www.youtube.com/embed/JxawsYAOTwA?si=AmiWsAfJa2VOzgLr`) 16:9 responsive video çerçevesi ile entegre edildi.
       - **Takimetre:** İstenen YouTube videosu (`https://www.youtube.com/embed/2e5vrBVNXzg?si=SLJd8jNTEXz963rz`) 16:9 responsive video çerçevesi ile entegre edildi.
       - **GMT Bezeli:** 24 saatlik ibre ve çift yönlü bezel ile 3 farklı zaman dilimini takip etme videosu.
     - Modal kapatıldığında YouTube videosunun arkaplanda ses çalmaya devam etmesini önleyen otomatik durdurma mekanizması (`script.js`) entegre edildi.


7. **Ödev Kabul Kriterlerine Uygun "Hakkında" Sayfası (`hakkinda.html`):**
   - **Kabul Kriteri 1 (Konuyu Seçme Gerekçesi):**
     - Mekanik zeka ve mikro mühendislik mükemmeliyeti (pilsiz, mikron düzeyinde parçalarla zamanı bölme).
     - Modern "kullan-at" kültürüne karşı sürdürülebilirlik ve nesiller boyu aktarılabilirlik.
     - Türkçe kaynaklardaki ticari reklam kirliliği ve tarafsız, kapsamlı referans eksikliği.
     - Soyut teorik bilgiyi modern web teknolojileriyle (Canvas simülasyonu, anlık arama) somutlaştırma vizyonu.
   - **Kabul Kriteri 2 (Sitenin Ziyaretçiye Nasıl Yardımcı Olduğu):**
     - Kapalı saat kasasının içini interaktif Canvas simülatörüyle açıp ağır çekimde izletme imkânı.
     - 8 popüler kalibre için 4 kademeli filtreleme ile bilinçli saat seçimi ve karşılaştırma aracı.
     - Tourbillon, Chronograph gibi karmaşık horolojik komplikasyonları sadeleştirerek anlatma.
     - Bezellerin yalnızca süs olmadığını gösteren adım adım kullanım kılavuzları, matematiksel formüller ve entegre video eğitimleri.
     - %100 reklamsız, hızlı, modern tipografili ve WAI-ARIA erişilebilir bağımsız bilgi erişimi.
   - **Ödev Künyesi & Standartlar Tablosu:**
     - Proje künyesi, teknik mimari (HTML5 Semantic, Responsive CSS3, Vanilla JS ES6+) ve kabul kriterleri karşılama durumunu belgeleyen tablo entegre edildi.
   - **Navigasyon ve Footer Entegrasyonu:**
     - `index.html`, `mekanizmalar.html`, `komplikasyonlar.html`, `bezeller.html` ve `hakkinda.html` sayfalarının üst menü ve alt footer bağlantılarına "Hakkında" sayfası aktif durum göstergeleriyle eklendi.
