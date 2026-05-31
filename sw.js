const CACHE_NAME = 'PEM3-cache-v1';
// รายชื่อไฟล์ทั้งหมดที่ต้องการให้ใช้งานแบบออฟไลน์ได้
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './PEM3-192.png',
  './PEM3-512.png'
];

// 1. ขั้นตอน Install: ทำการสร้าง Cache และบันทึกไฟล์
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('กำลังแคชไฟล์ระบบ...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // บังคับให้ Service Worker ตัวใหม่ทำงานทันที
  );
});

// 2. ขั้นตอน Activate: ลบ Cache เก่าที่ไม่ได้ใช้ (เคลียร์ไฟล์ขยะเวลาอัปเดตเวอร์ชัน)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('กำลังลบ Cache เก่า:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. ขั้นตอน Fetch: ดึงข้อมูลจาก Cache มาแสดงก่อนเพื่อให้เปิดเว็บได้แม้ออฟไลน์
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ถ้าเจอไฟล์ใน Cache ให้ส่งไฟล์นั้นไปเลย, ถ้าไม่เจอให้ไปโหลดจากเน็ตตามปกติ
        return response || fetch(event.request);
      })
  );
});
