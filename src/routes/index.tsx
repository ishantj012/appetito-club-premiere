import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Award, Users, Sparkles, Leaf, Heart, UtensilsCrossed, Wine, Coffee,
  MapPin, Phone, Clock, Instagram, Facebook, Twitter, ArrowUp, MessageCircle,
  Star, ChevronDown, X, Search, Menu, Calendar as CalIcon, Trophy, Bike, Flag,
  Cake, Building2, PartyPopper, ChefHat, Sprout,
} from "lucide-react";

import heroInterior from "@/assets/hero-interior.jpg";
import dishPasta from "@/assets/dish-pasta.jpg";
import dishTiramisu from "@/assets/dish-tiramisu.jpg";
import dishMocktail from "@/assets/dish-mocktail.jpg";
import dishPizza from "@/assets/dish-pizza.jpg";
import dishMezze from "@/assets/dish-mezze.jpg";
import dishButter from "@/assets/dish-butterchicken.jpg";
import dishNachos from "@/assets/dish-nachos.jpg";
import dishBrownie from "@/assets/dish-brownie.jpg";
import dishLatte from "@/assets/dish-latte.jpg";
import expOutdoor from "@/assets/exp-outdoor.jpg";
import expPickleball from "@/assets/exp-pickleball.jpg";
import expGolf from "@/assets/exp-golf.jpg";
import galleryCouple from "@/assets/gallery-couple.jpg";
import galleryChef from "@/assets/gallery-chef.jpg";
import galleryPrivate from "@/assets/gallery-private.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    links: [{ rel: "canonical", href: "/" }],
  }),
});

/* ---------- helpers ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-gold">
      <span className="h-px w-8 bg-gold/60" />
      {children}
    </div>
  );
}

/* ---------- Data ---------- */

const signatureDishes = [
  { name: "Tiramisu", desc: "Mascarpone, espresso-soaked ladyfingers, gold leaf.", price: "₹ 420", rating: 4.9, img: dishTiramisu, tag: "Signature Dessert" },
  { name: "Lebanese Veg Mezze", desc: "Hummus, muhammara, olives, warm pita.", price: "₹ 640", rating: 4.8, img: dishMezze, tag: "Chef's Pick" },
  { name: "Mad Mushroom Pizza", desc: "Wild mushrooms, truffle oil, mozzarella.", price: "₹ 590", rating: 4.9, img: dishPizza, tag: "Wood Fired" },
  { name: "Butter Chicken", desc: "Slow-cooked tomato, cream, fenugreek.", price: "₹ 520", rating: 4.9, img: dishButter, tag: "House Favourite" },
  { name: "Pasta Aglio Olio", desc: "Extra-virgin olive oil, garlic, chilli, parsley.", price: "₹ 460", rating: 4.7, img: dishPasta, tag: "Classic" },
  { name: "Loaded Nachos", desc: "Cheese, jalapeño, salsa fresca, sour cream.", price: "₹ 380", rating: 4.7, img: dishNachos, tag: "Sharing" },
  { name: "Mango Colada", desc: "Alphonso mango, coconut cream, lime.", price: "₹ 320", rating: 4.9, img: dishMocktail, tag: "Handcrafted" },
  { name: "Brownie & Ice Cream", desc: "Warm chocolate brownie, vanilla bean.", price: "₹ 340", rating: 4.8, img: dishBrownie, tag: "Warm" },
  { name: "House Latte", desc: "Single-origin espresso, silken milk.", price: "₹ 220", rating: 4.8, img: dishLatte, tag: "Café" },
];

const experiences = [
  { title: "Pickleball", desc: "Championship-grade courts under open skies.", img: expPickleball, icon: Trophy },
  { title: "Mini Golf", desc: "A whimsical 9-hole course beside the garden.", img: expGolf, icon: Flag },
  { title: "Outdoor Dining", desc: "Candlelit tables beneath olive trees.", img: expOutdoor, icon: Sprout },
  { title: "Private Dining", desc: "An intimate marble room for twelve.", img: galleryPrivate, icon: Building2 },
  { title: "Celebrations", desc: "Birthdays, anniversaries, family reunions.", img: galleryCouple, icon: Cake },
  { title: "Corporate Events", desc: "Bespoke evenings for teams and clients.", img: galleryChef, icon: PartyPopper },
];

const menuData: Record<string, { name: string; desc: string; price: string }[]> = {
  Starters: [
    { name: "Zucchini Fries", desc: "Panko crumb, aioli", price: "₹ 340" },
    { name: "Loaded Nachos", desc: "Cheese, salsa, jalapeño", price: "₹ 380" },
    { name: "Peri Peri Cheesy Fries", desc: "African bird's-eye chilli", price: "₹ 310" },
  ],
  Soups: [
    { name: "Clear Wonton Soup", desc: "Chicken, ginger, coriander", price: "₹ 290" },
    { name: "Tom Kha", desc: "Coconut, galangal, lime", price: "₹ 320" },
  ],
  Pizza: [
    { name: "Mad Mushroom", desc: "Wild mushrooms, truffle oil", price: "₹ 590" },
    { name: "Margherita di Bufala", desc: "San Marzano, buffalo mozzarella", price: "₹ 540" },
  ],
  Pasta: [
    { name: "Aglio Olio", desc: "Garlic, chilli, parsley", price: "₹ 460" },
    { name: "Peri Peri Penne", desc: "Creamy peri peri, herbs", price: "₹ 490" },
    { name: "Lamb Lasagna", desc: "Slow-braised lamb ragù", price: "₹ 620" },
  ],
  "Asian Cuisine": [
    { name: "Coconut Curry Noodles", desc: "Thai red curry, jasmine rice", price: "₹ 510" },
    { name: "Vietnamese Grill Chicken", desc: "Lemongrass, nuoc cham", price: "₹ 560" },
    { name: "Pan Asian Veg Platter", desc: "Chef's selection", price: "₹ 690" },
  ],
  "Indian Cuisine": [
    { name: "Butter Chicken", desc: "Slow-cooked tomato, cream", price: "₹ 520" },
    { name: "Dal Appetito", desc: "24-hour slow simmered", price: "₹ 380" },
  ],
  "Main Course": [
    { name: "Chicken Shroom Supreme", desc: "Herb butter, mushroom jus", price: "₹ 640" },
    { name: "Vietnamese Grill Chicken", desc: "Charred, aromatic", price: "₹ 560" },
  ],
  Desserts: [
    { name: "Tiramisu", desc: "Mascarpone, espresso", price: "₹ 420" },
    { name: "Brownie with Ice Cream", desc: "Warm, decadent", price: "₹ 340" },
  ],
  Mocktails: [
    { name: "Mango Colada", desc: "Alphonso, coconut", price: "₹ 320" },
    { name: "Basil Smash", desc: "Basil, lime, elderflower", price: "₹ 300" },
  ],
  Coffee: [
    { name: "House Latte", desc: "Silken milk, single-origin", price: "₹ 220" },
    { name: "Cortado", desc: "Balanced, warm", price: "₹ 210" },
  ],
};

const reviews = [
  { text: "Appetito is one of the finest restaurants in Greater Noida. The food, ambience, and service are outstanding.", name: "Aarav Sharma" },
  { text: "The pizzas, mocktails, and desserts are absolutely delicious. Highly recommended.", name: "Nisha Verma" },
  { text: "Perfect place for families, dates, and celebrations. Excellent hospitality.", name: "Rohan Malhotra" },
  { text: "A premium dining experience with beautiful interiors and amazing staff.", name: "Priya Kapoor" },
];

const galleryImages = [
  { src: heroInterior, alt: "Restaurant interior", span: "col-span-2 row-span-2" },
  { src: expOutdoor, alt: "Outdoor seating", span: "col-span-2" },
  { src: dishPizza, alt: "Wood-fired pizza", span: "" },
  { src: dishMocktail, alt: "Handcrafted mocktail", span: "" },
  { src: galleryCouple, alt: "Couple dining", span: "col-span-2" },
  { src: galleryChef, alt: "Chef at work", span: "" },
  { src: dishTiramisu, alt: "Tiramisu dessert", span: "" },
  { src: expPickleball, alt: "Pickleball court", span: "col-span-2" },
  { src: expGolf, alt: "Mini golf", span: "" },
  { src: galleryPrivate, alt: "Private dining room", span: "col-span-2" },
  { src: dishButter, alt: "Butter chicken", span: "" },
];

/* ---------- Cursor Glow ---------- */

function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] hidden md:block"
      style={{
        background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, oklch(0.76 0.09 82 / 0.08), transparent 70%)`,
      }}
    />
  );
}

/* ---------- Navbar ---------- */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["About", "#about"],
    ["Menu", "#menu"],
    ["Experiences", "#experiences"],
    ["Gallery", "#gallery"],
    ["Contact", "#contact"],
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass py-3" : "py-6"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-wide">
            Appetito<span className="text-gold">.</span>
          </span>
        </a>
        <ul className="hidden items-center gap-10 text-sm text-foreground/80 md:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className="relative inline-block transition-colors hover:text-gold after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-500 hover:after:w-full"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#reserve"
          className="btn-gold hidden rounded-full px-6 py-2.5 text-xs uppercase tracking-widest md:inline-block"
        >
          Reserve
        </a>
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 glass md:hidden"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 text-foreground"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            <ul className="flex h-full flex-col items-center justify-center gap-8 text-xl">
              {links.map(([label, href]) => (
                <li key={href}>
                  <a href={href} onClick={() => setOpen(false)} className="font-display">
                    {label}
                  </a>
                </li>
              ))}
              <a
                href="#reserve"
                onClick={() => setOpen(false)}
                className="btn-gold rounded-full px-8 py-3"
              >
                Reserve
              </a>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-screen w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroInterior}
          alt="Appetito Club interior"
          className="h-full w-full object-cover"
          fetchPriority="high"
          width={1920}
          height={1200}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-gold"
        >
          <span className="h-px w-10 bg-gold/60" />
          Greater Noida · Est. Fine Dining
          <span className="h-px w-10 bg-gold/60" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-[88px]"
        >
          Where Exceptional Dining
          <br />
          <span className="italic text-gold-gradient">Meets Extraordinary</span> Experiences
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="mt-8 max-w-2xl text-base text-foreground/75 md:text-lg"
        >
          Experience Greater Noida's finest destination for premium dining, handcrafted beverages,
          world cuisine, outdoor experiences, and unforgettable moments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a href="#reserve" className="btn-gold rounded-full px-9 py-4 text-sm uppercase tracking-widest">
            Reserve a Table
          </a>
          <a href="#menu" className="btn-outline-gold rounded-full px-9 py-4 text-sm uppercase tracking-widest">
            Explore Menu
          </a>
        </motion.div>
      </motion.div>

      {/* Floating reservation card */}
      <motion.aside
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.9 }}
        className="absolute bottom-24 right-6 z-10 hidden w-[280px] rounded-2xl p-5 glass animate-floaty lg:block"
      >
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gold">
          <CalIcon size={14} /> Tonight's Availability
        </div>
        <div className="mt-3 font-display text-2xl">Tables for Two</div>
        <div className="mt-1 text-xs text-foreground/70">7:30 PM · 8:15 PM · 9:00 PM</div>
        <a href="#reserve" className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gold py-2.5 text-xs font-medium text-matte">
          Book instantly
        </a>
      </motion.aside>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <div className="mx-auto flex h-10 w-6 justify-center rounded-full border border-gold/50 p-1">
          <span className="block h-2 w-1 rounded-full bg-gold animate-scroll-dot" />
        </div>
        <div className="mt-2 text-[10px] uppercase tracking-widest text-foreground/60">Scroll</div>
      </div>
    </section>
  );
}

/* ---------- Marquee ---------- */

function Marquee() {
  const items = ["Fine Dining", "World Cuisine", "Handcrafted Mocktails", "Outdoor Seating", "Private Dining", "Pickleball", "Mini Golf", "Vegan Friendly"];
  return (
    <div className="border-y border-gold/15 bg-charcoal py-6 overflow-hidden">
      <div className="flex animate-[shimmer_40s_linear_infinite] whitespace-nowrap gap-14 text-2xl font-display">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-14 text-foreground/70">
            {it}
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- About ---------- */

function About() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl grid gap-16 md:grid-cols-2 md:items-center">
        <Reveal>
          <SectionEyebrow>Our Story</SectionEyebrow>
          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            A destination where every <span className="italic text-gold-gradient">detail</span> is
            considered.
          </h2>
          <p className="mt-8 text-foreground/75 md:text-lg leading-relaxed">
            Appetito Club is more than a restaurant — it is Greater Noida's fine dining
            sanctuary. A modern café by day, a candlelit destination by night, we serve
            international cuisine crafted with obsessive care, in an environment designed for
            couples, families and gatherings that deserve to be remembered.
          </p>
          <p className="mt-4 text-foreground/70 leading-relaxed">
            From our vegan menu and outdoor gardens to our private dining room and lifestyle
            experiences — pickleball, mini golf, cycling — we exist to make ordinary evenings
            extraordinary.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-gold/15 pt-8">
            <div>
              <div className="font-display text-4xl text-gold-gradient">4.5<span className="text-lg">★</span></div>
              <div className="mt-1 text-xs uppercase tracking-widest text-foreground/60">Google Rating</div>
            </div>
            <div>
              <div className="font-display text-4xl text-gold-gradient">1800+</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-foreground/60">Happy Guests</div>
            </div>
            <div>
              <div className="font-display text-4xl text-gold-gradient">18</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-foreground/60">Signatures</div>
            </div>
          </div>
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-4">
          <div className="zoom-img col-span-2 aspect-[4/3] overflow-hidden rounded-2xl">
            <img src={galleryPrivate} alt="Private dining room" loading="lazy" width={1400} height={1000} className="h-full w-full object-cover" />
          </div>
          <div className="zoom-img aspect-square overflow-hidden rounded-2xl">
            <img src={expOutdoor} alt="Outdoor garden" loading="lazy" width={1400} height={1200} className="h-full w-full object-cover" />
          </div>
          <div className="zoom-img aspect-square overflow-hidden rounded-2xl">
            <img src={galleryChef} alt="Chef plating" loading="lazy" width={1200} height={1400} className="h-full w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Signature Dishes ---------- */

function SignatureDishes() {
  return (
    <section id="signatures" className="relative py-32 px-6 bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 max-w-2xl">
          <SectionEyebrow>The Signature Collection</SectionEyebrow>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Dishes plated with <span className="italic text-gold-gradient">intention</span>.
          </h2>
          <p className="mt-6 text-foreground/70">
            Nine of the moments our guests return for — from wood-fired pizzas to house-made
            tiramisu and handcrafted mocktails.
          </p>
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {signatureDishes.map((d) => (
            <motion.article
              key={d.name}
              variants={fadeUp}
              className="group hover-lift zoom-img relative overflow-hidden rounded-2xl bg-background border border-gold/10"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img src={d.img} alt={d.name} loading="lazy" width={1200} height={1400} className="h-full w-full object-cover" />
              </div>
              <div className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                {d.tag}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/85 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">{d.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gold">
                    <Star size={12} fill="currentColor" /> {d.rating}
                  </div>
                </div>
                <p className="mt-2 text-sm text-foreground/70">{d.desc}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gold-gradient font-medium">{d.price}</span>
                  <span className="text-xs uppercase tracking-widest text-foreground/50 group-hover:text-gold transition-colors">
                    Order →
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Why Choose Us ---------- */

function WhyChooseUs() {
  const features = [
    { icon: Star, title: "4.5★ Google Rating", desc: "Loved by 1,800+ guests." },
    { icon: Users, title: "1800+ Happy Guests", desc: "A destination that keeps them returning." },
    { icon: Award, title: "Premium Experience", desc: "Every detail obsessed over." },
    { icon: UtensilsCrossed, title: "International Cuisine", desc: "Italian, Indian, Pan-Asian, Lebanese." },
    { icon: Sprout, title: "Outdoor Seating", desc: "Candlelit tables under olive trees." },
    { icon: Building2, title: "Private Dining", desc: "An intimate marble room for twelve." },
    { icon: Leaf, title: "Vegan Options", desc: "Thoughtful menus for every guest." },
    { icon: Heart, title: "Exceptional Hospitality", desc: "Warm, discreet, remembered." },
    { icon: Cake, title: "Signature Desserts", desc: "Tiramisu, brownie, seasonal specials." },
    { icon: Wine, title: "Handcrafted Mocktails", desc: "Fresh fruit, botanicals, ice." },
    { icon: Users, title: "Family Friendly", desc: "Space and service for every generation." },
    { icon: Heart, title: "Romantic Ambience", desc: "Low lighting, still air, soft music." },
  ];
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <SectionEyebrow>Why Appetito</SectionEyebrow>
          <h2 className="font-display text-4xl md:text-6xl">The difference is in the details.</h2>
        </Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp}
              className="hover-lift group rounded-2xl border border-gold/10 bg-charcoal p-7 transition-colors hover:border-gold/40">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold group-hover:bg-gold group-hover:text-matte transition-colors">
                <f.icon size={20} />
              </div>
              <h3 className="font-display text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-foreground/65">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Experiences ---------- */

function Experiences() {
  return (
    <section id="experiences" className="relative py-32 px-6 bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>More than a Restaurant</SectionEyebrow>
            <h2 className="font-display text-4xl md:text-6xl leading-tight">
              A lifestyle <span className="italic text-gold-gradient">destination</span> — beyond the plate.
            </h2>
          </div>
          <p className="max-w-md text-foreground/70">
            Play a set of pickleball, sink a putt on the mini-golf green, cycle the property, or
            simply linger under our garden lights.
          </p>
        </Reveal>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((e) => (
            <motion.article key={e.title} variants={fadeUp}
              className="hover-lift zoom-img group relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={e.img} alt={e.title} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-matte via-matte/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg glass text-gold">
                  <e.icon size={18} />
                </div>
                <h3 className="font-display text-2xl md:text-3xl">{e.title}</h3>
                <p className="mt-2 text-sm text-foreground/75">{e.desc}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Menu ---------- */

function Menu() {
  const categories = Object.keys(menuData);
  const [active, setActive] = useState(categories[0]);
  const [query, setQuery] = useState("");
  const items = menuData[active].filter((i) =>
    (i.name + " " + i.desc).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section id="menu" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionEyebrow>The Menu</SectionEyebrow>
            <h2 className="font-display text-4xl md:text-6xl">A curated <span className="italic text-gold-gradient">tasting</span>.</h2>
          </div>
          <div className="flex items-center gap-3 rounded-full glass px-4 py-2.5 w-full md:w-80">
            <Search size={16} className="text-gold" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu…"
              className="w-full bg-transparent text-sm placeholder:text-foreground/40 focus:outline-none"
            />
          </div>
        </Reveal>

        <Reveal>
          <div className="mb-10 flex flex-wrap gap-2 border-b border-gold/15 pb-4">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest transition-all ${
                  active === c
                    ? "bg-gold text-matte"
                    : "text-foreground/60 hover:text-gold"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div
          key={active + query}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-x-14 gap-y-6 md:grid-cols-2"
        >
          {items.length === 0 && (
            <div className="col-span-2 py-10 text-center text-foreground/50">No dishes match your search.</div>
          )}
          {items.map((i) => (
            <motion.div key={i.name} variants={fadeUp}
              className="group flex items-baseline justify-between gap-6 border-b border-gold/10 pb-5 transition-colors hover:border-gold/30">
              <div>
                <div className="font-display text-xl group-hover:text-gold transition-colors">{i.name}</div>
                <div className="mt-1 text-sm text-foreground/60">{i.desc}</div>
              </div>
              <div className="whitespace-nowrap font-medium text-gold-gradient">{i.price}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Gallery ---------- */

function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  return (
    <section id="gallery" className="relative py-32 px-6 bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-14 max-w-2xl">
          <SectionEyebrow>Gallery</SectionEyebrow>
          <h2 className="font-display text-4xl md:text-6xl">Moments from <span className="italic text-gold-gradient">Appetito</span>.</h2>
        </Reveal>

        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-[220px]">
          {galleryImages.map((g, i) => (
            <motion.button
              key={i}
              onClick={() => setLightbox(g.src)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.7 }}
              className={`zoom-img relative overflow-hidden rounded-2xl ${g.span}`}
            >
              <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-matte/0 transition-colors hover:bg-matte/20" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-matte/90 p-6 backdrop-blur-md"
          >
            <button className="absolute right-6 top-6 text-foreground" onClick={() => setLightbox(null)} aria-label="Close">
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.92 }} animate={{ scale: 1 }}
              src={lightbox}
              alt=""
              className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Reviews carousel ---------- */

function Reviews() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <SectionEyebrow><span className="mx-auto">Guest Reviews</span></SectionEyebrow>
          <div className="mb-8 flex justify-center gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, k) => (
              <Star key={k} size={18} fill="currentColor" />
            ))}
          </div>
        </Reveal>

        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="font-display text-2xl leading-relaxed md:text-4xl"
            >
              "{reviews[i].text}"
              <footer className="mt-8 text-sm uppercase tracking-widest text-gold">
                — {reviews[i].name}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {reviews.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Review ${k + 1}`}
              className={`h-1 rounded-full transition-all ${k === i ? "w-10 bg-gold" : "w-4 bg-foreground/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Reservation ---------- */

function Reservation() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", guests: "2", date: "", time: "19:30", occasion: "Dinner",
  });
  const on = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="reserve" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={galleryCouple} alt="" className="h-full w-full object-cover opacity-25" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-matte via-matte/85 to-matte" />
      </div>

      <div className="mx-auto max-w-4xl">
        <Reveal className="mb-12 text-center">
          <SectionEyebrow><span className="mx-auto">Reservations</span></SectionEyebrow>
          <h2 className="font-display text-4xl md:text-6xl">Reserve your <span className="italic text-gold-gradient">table</span>.</h2>
          <p className="mt-4 text-foreground/70">We confirm every reservation within the hour.</p>
        </Reveal>

        <Reveal>
          <form onSubmit={submit} className="glass rounded-3xl p-8 md:p-12">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full Name">
                <input required value={form.name} onChange={on("name")} className="input" placeholder="Your name" />
              </Field>
              <Field label="Phone Number">
                <input required value={form.phone} onChange={on("phone")} className="input" placeholder="+91 ..." />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={on("email")} className="input" placeholder="you@example.com" />
              </Field>
              <Field label="Number of Guests">
                <select value={form.guests} onChange={on("guests")} className="input">
                  {[1,2,3,4,5,6,7,8,"9+"].map((n) => <option key={n} value={n}>{n} guest{n !== 1 && "s"}</option>)}
                </select>
              </Field>
              <Field label="Date">
                <input required type="date" value={form.date} onChange={on("date")} className="input" />
              </Field>
              <Field label="Time">
                <input required type="time" value={form.time} onChange={on("time")} className="input" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Occasion">
                  <select value={form.occasion} onChange={on("occasion")} className="input">
                    {["Dinner","Birthday","Anniversary","Date Night","Family Gathering","Corporate","Other"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
            </div>
            <button type="submit" className="btn-gold mt-8 w-full rounded-full py-4 text-sm uppercase tracking-widest">
              {sent ? "Request Sent ✓ We'll be in touch" : "Reserve Now"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-widest text-foreground/60">{label}</span>
      {children}
    </label>
  );
}

/* ---------- Contact ---------- */

function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6 bg-charcoal">
      <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionEyebrow>Visit Us</SectionEyebrow>
          <h2 className="font-display text-4xl md:text-6xl">Find your seat at <span className="italic text-gold-gradient">Appetito</span>.</h2>

          <div className="mt-10 space-y-6">
            <InfoRow icon={MapPin} title="Address">
              R3, Knowledge Park II<br />Greater Noida, Uttar Pradesh 201310
            </InfoRow>
            <InfoRow icon={Phone} title="Phone">
              <a href="tel:08860023344" className="hover:text-gold transition-colors">088600 23344</a>
            </InfoRow>
            <InfoRow icon={Clock} title="Opening Hours">
              Open daily · Closes at 10:30 PM
            </InfoRow>
          </div>

          <div className="mt-10 flex gap-3">
            <a href="#reserve" className="btn-gold rounded-full px-7 py-3 text-xs uppercase tracking-widest">Reserve a Table</a>
            <a href="tel:08860023344" className="btn-outline-gold rounded-full px-7 py-3 text-xs uppercase tracking-widest">Call Now</a>
          </div>
        </Reveal>

        <Reveal>
          <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-gold/15">
            <iframe
              title="Appetito Club location"
              src="https://www.google.com/maps?q=Knowledge+Park+II,+Greater+Noida,+Uttar+Pradesh+201310&output=embed"
              loading="lazy"
              className="h-full w-full grayscale contrast-125"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-foreground/50">{title}</div>
        <div className="mt-1 text-foreground/85">{children}</div>
      </div>
    </div>
  );
}

/* ---------- FAQ ---------- */

const faqs = [
  { q: "Do you take walk-ins?", a: "We welcome walk-ins subject to availability, but a reservation guarantees your table." },
  { q: "Is there vegan food?", a: "Yes — we have a dedicated vegan menu and can adapt many dishes on request." },
  { q: "Can I book the private dining room?", a: "Our private room seats up to twelve. Contact us to arrange a bespoke menu." },
  { q: "Do you host private events?", a: "Absolutely — birthdays, anniversaries, corporate dinners and celebrations." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-12 text-center">
          <SectionEyebrow><span className="mx-auto">Questions</span></SectionEyebrow>
          <h2 className="font-display text-4xl md:text-5xl">Before you visit.</h2>
        </Reveal>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={i}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full rounded-2xl border border-gold/15 bg-charcoal p-6 text-left transition-colors hover:border-gold/40">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-lg md:text-xl">{f.q}</span>
                  <ChevronDown size={18} className={`text-gold transition-transform ${open === i ? "rotate-180" : ""}`} />
                </div>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}
                      className="overflow-hidden">
                      <p className="mt-4 text-foreground/70">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Newsletter & Footer ---------- */

function Newsletter() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-4xl rounded-3xl border border-gold/20 bg-charcoal p-10 text-center md:p-16">
        <SectionEyebrow><span className="mx-auto">The Insider</span></SectionEyebrow>
        <h2 className="font-display text-3xl md:text-5xl">Seasonal specials, straight to you.</h2>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">Chef's tables, tasting menus, weekend brunches. Once a month, never more.</p>
        <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
          <input type="email" required placeholder="Your email address"
            className="input flex-1" />
          <button className="btn-gold rounded-full px-7 py-3 text-xs uppercase tracking-widest">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-matte px-6 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <div className="font-display text-3xl">Appetito<span className="text-gold">.</span></div>
          <p className="mt-4 text-sm text-foreground/60">
            Greater Noida's premier destination for premium dining and lifestyle experiences.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 text-foreground/70 transition-colors hover:border-gold hover:text-gold">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4 text-[11px] uppercase tracking-widest text-gold">Explore</div>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><a href="#about" className="hover:text-gold">About</a></li>
            <li><a href="#menu" className="hover:text-gold">Menu</a></li>
            <li><a href="#experiences" className="hover:text-gold">Experiences</a></li>
            <li><a href="#gallery" className="hover:text-gold">Gallery</a></li>
          </ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] uppercase tracking-widest text-gold">Contact</div>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li>R3, Knowledge Park II, Greater Noida, UP 201310</li>
            <li><a href="tel:08860023344" className="hover:text-gold">088600 23344</a></li>
            <li>Open daily · until 10:30 PM</li>
          </ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] uppercase tracking-widest text-gold">Legal</div>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><a href="#" className="hover:text-gold">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gold">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-gold/10 pt-6 text-xs text-foreground/50 md:flex-row">
        <div>© {new Date().getFullYear()} Appetito Club. All rights reserved.</div>
        <div>Crafted with intention · Greater Noida</div>
      </div>
    </footer>
  );
}

/* ---------- Floating widgets ---------- */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gold" />
  );
}

function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <a
        href="https://wa.me/918860023344"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp us"
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/40 transition-transform hover:scale-110"
      >
        <MessageCircle size={22} />
      </a>
      <AnimatePresence>
        {show && (
          <>
            <motion.a
              href="#reserve"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="btn-gold fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full px-6 py-3 text-xs uppercase tracking-widest md:hidden"
            >
              Reserve
            </motion.a>
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              aria-label="Back to top"
              className="fixed bottom-24 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full glass text-gold transition-transform hover:-translate-y-1"
            >
              <ArrowUp size={16} />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Loading screen ---------- */

function Loader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-matte"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="font-display text-5xl md:text-7xl">
              Appetito<span className="text-gold">.</span>
            </div>
            <div className="mt-6 h-px w-40 mx-auto overflow-hidden bg-foreground/10">
              <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 1.4, ease: "easeInOut" }}
                className="h-full w-full bg-gold" />
            </div>
            <div className="mt-4 text-[10px] uppercase tracking-[0.4em] text-foreground/50">
              Fine Dining · Greater Noida
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Chef spotlight ---------- */

function ChefSpotlight() {
  return (
    <section className="relative py-32 px-6 bg-charcoal">
      <div className="mx-auto max-w-7xl grid gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal className="zoom-img aspect-[4/5] overflow-hidden rounded-3xl">
          <img src={galleryChef} alt="Executive Chef" loading="lazy" className="h-full w-full object-cover" />
        </Reveal>
        <Reveal>
          <SectionEyebrow>Chef's Spotlight</SectionEyebrow>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            <span className="italic text-gold-gradient">Craft</span> that quietly speaks for itself.
          </h2>
          <p className="mt-6 text-foreground/75 leading-relaxed">
            Our kitchen is led by chefs trained across Italy, Thailand and India. From wood-fired
            dough proofed for 48 hours, to slow-simmered curries, every dish leaves the pass only
            when it's worthy of the room.
          </p>
          <div className="mt-8 flex items-center gap-4 text-sm text-foreground/60">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold"><ChefHat size={16} /></div>
            Executive Team · Est. 2019
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

function Home() {
  return (
    <div className="relative bg-background text-foreground">
      <Loader />
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <SignatureDishes />
        <WhyChooseUs />
        <Experiences />
        <ChefSpotlight />
        <Menu />
        <Gallery />
        <Reviews />
        <Reservation />
        <Contact />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
