# RUJAK.Co V2 - Tropical Modernism Redesign TODO

## Design System Implementation
- [x] Apply Tropical Modernism color palette (Cream #FEFDF8, Forest Green #1B5E20, Mango Gold #FFB300)
- [x] Configure typography (Fraunces for display, DM Sans for body)
- [x] Update button styles (pill-shaped, 999px border-radius)
- [x] Update card styles (12px border-radius)
- [x] Update shadows and elevation system
- [x] Update spacing and grid system

## Home Page Sections (in order)
- [x] Header with navigation and cart button
- [x] Hero section (split layout: text left 40%, image right 60%)
- [x] Mood greeting section
- [x] Spotlight section
- [x] Products grid with category filter
- [x] DeliveryOptions section (informational)
- [x] FreshToday section
- [x] LiveKitchen section
- [x] Testimonials section
- [x] FAQ section
- [x] Footer

## Product Detail & Cart Features
- [x] Product card click opens detail swiper overlay
- [x] Product detail swiper with spice level selector (1-5)
- [x] Quantity control in product detail
- [x] Add-to-cart button in product detail
- [x] Cart drawer with all customer data fields
- [x] District autocomplete search
- [ ] Delivery time selector
- [x] Courier selection (Lalamove Reguler, Lalamove Prioritas, Paxel)
- [x] Dynamic shipping cost calculation
- [ ] Order confirmation modal
- [x] QRIS payment modal
- [x] Receipt download functionality

## User Experience Features
- [x] Onboarding overlay (new user name prompt)
- [x] Returning user welcome message
- [x] User name and district localStorage persistence
- [x] Header displays user name and district
- [x] Bottom navigation (Home, Cart, Products, AI Chat)
- [x] AI Concierge chat integration
- [x] About modal

## Advanced Features
- [x] Supabase integration for order storage
- [x] Offline order queue (retry on reconnect)
- [x] WhatsApp order notification
- [x] Telegram admin notification
- [x] Order tracking page (lacak.html)
- [x] Admin dashboard (admin.html) — orders list + status update + realtime; product CRUD/Studio/Buku Master tabs not ported (different data architecture, see README note)
- [ ] Analytics tracking
- [x] Service worker for offline support

## Styling & Polish
- [ ] Responsive design (mobile-first)
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Motion and animations (snappy, <300ms)
- [ ] Loading states and skeletons
- [ ] Error handling and toast notifications
- [ ] Dark/light theme support (if needed)

## Testing & Verification
- [ ] Product detail overlay opens correctly
- [ ] Cart calculations are accurate
- [ ] Shipping cost calculation works
- [ ] Order submission to Supabase succeeds
- [ ] Offline queue functionality works
- [ ] localStorage persistence works
- [ ] Mobile responsiveness verified
- [ ] All modals and overlays work correctly
