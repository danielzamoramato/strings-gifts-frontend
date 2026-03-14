export const CATEGORIES = [
  { key: "pulseras",   label: "Pulseras",   emoji: "💫" },
  { key: "collares",   label: "Collares",   emoji: "✨" },
  { key: "aretes",     label: "Aretes",     emoji: "🌸" },
  { key: "tobilleras", label: "Tobilleras", emoji: "🌊" },
];

export const PRODUCTS = {
  pulseras: [
    { id: 1,  name: "Pulsera Perlas Nude",    price: 580,  stock: 12, desc: "Perlas naturales 6mm con cierre de plata 925",    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", variants: ["S","M","L"], isNew: true },
    { id: 2,  name: "Pulsera Cristal Aurora", price: 720,  stock: 3,  desc: "Cristales facetados efecto arcoíris",              img: "https://images.unsplash.com/photo-1573408301185-9519f94f4a2a?w=600&q=80", variants: ["S","M","L"] },
    { id: 3,  name: "Pulsera Macramé Boho",   price: 450,  stock: 20, desc: "Hilo encerado trenzado con dije de luna",          img: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80", variants: ["Única"] },
    { id: 4,  name: "Cadena Dorada 18k",      price: 890,  stock: 5,  desc: "Acero inoxidable chapado en oro 18k",              img: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&q=80", variants: ["S","M","L"] },
    { id: 5,  name: "Pulsera Corazón",        price: 650,  stock: 0,  desc: "Dijes de corazón con perlas semilla",              img: "https://images.unsplash.com/photo-1631982690223-8aa69d7353d3?w=600&q=80", variants: ["S","M"] },
    { id: 6,  name: "Pulsera Tropicana",      price: 490,  stock: 8,  desc: "Colores vibrantes con cuentas acrílicas",          img: "https://images.unsplash.com/photo-1576022162879-d4b4c6b27d63?w=600&q=80", variants: ["Única"], isNew: true },
  ],
  collares: [
    { id: 7,  name: "Collar Perlas Clásico",  price: 600,  stock: 15, desc: "Collar de perlas 6mm sin dijes, elegante",        img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", variants: ["40cm","45cm","50cm"] },
    { id: 8,  name: "Collar Marinero",        price: 720,  stock: 10, desc: "Cierre marinero con dije variable 4-8mm",          img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", variants: ["40cm","45cm"] },
    { id: 9,  name: "Choker Delicado",        price: 550,  stock: 18, desc: "Cadena fina con dije de Strings Gifts dorada",          img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80", variants: ["35cm","38cm"], isNew: true },
    { id: 10, name: "Set Layering x3",        price: 1100, stock: 4,  desc: "Set de 3 collares para combinar a tu gusto",       img: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80", variants: ["Única"] },
    { id: 11, name: "Gargantilla Rígida",     price: 850,  stock: 7,  desc: "Acero dorado con textura martillada",              img: "https://images.unsplash.com/photo-1573408301185-9519f94f4a2a?w=600&q=80", variants: ["Única"] },
    { id: 12, name: "Collar Estrellas",       price: 680,  stock: 0,  desc: "Dijes de estrella con circones",                  img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", variants: ["42cm","45cm"] },
  ],
  aretes: [
    { id: 13, name: "Perla Clásica",          price: 380,  stock: 25, desc: "Perla 8mm con gancho hipoalergénico",              img: "https://images.unsplash.com/photo-1561828995-aa79a2db86dd?w=600&q=80", variants: ["Única"] },
    { id: 14, name: "Aro Cristal",            price: 520,  stock: 14, desc: "Aros medianos con cristales colgantes",            img: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&q=80", variants: ["Pequeño","Mediano","Grande"], isNew: true },
    { id: 15, name: "Strings Gifts Esmaltada",     price: 460,  stock: 9,  desc: "Esmalte de colores con baño de oro",               img: "https://images.unsplash.com/photo-1573408301185-9519f94f4a2a?w=600&q=80", variants: ["Única"] },
    { id: 16, name: "Huggie Flores Resina",   price: 680,  stock: 7,  desc: "Huggie con flores artesanales de resina",          img: "https://images.unsplash.com/photo-1618085219724-c59ba48e08cd?w=600&q=80", variants: ["Única"] },
    { id: 17, name: "Lágrima Dorada",         price: 590,  stock: 11, desc: "Gota asimétrica chapada en oro 18k",               img: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&q=80", variants: ["Única"] },
    { id: 18, name: "Aretes Boho Flecos",     price: 430,  stock: 0,  desc: "Macramé con cuentas de madera natural",            img: "https://images.unsplash.com/photo-1561828995-aa79a2db86dd?w=600&q=80", variants: ["Única"] },
  ],
  tobilleras: [
    { id: 19, name: "Estrella de Mar",        price: 420,  stock: 16, desc: "Cadena fina con dije de estrella de mar",          img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80", variants: ["22cm","24cm","26cm"], isNew: true },
    { id: 20, name: "Perlas de Playa",        price: 500,  stock: 11, desc: "Perlas semilla con conchas naturales",             img: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&q=80", variants: ["22cm","24cm"] },
    { id: 21, name: "Macramé Marina",         price: 380,  stock: 22, desc: "Hilo encerado ajustable con concha nácar",         img: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80", variants: ["Ajustable"] },
    { id: 22, name: "Cadena Plata 925",       price: 620,  stock: 6,  desc: "Plata de ley con dije de luna y estrella",         img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", variants: ["22cm","24cm","26cm"] },
    { id: 23, name: "Tobillera Colorida",     price: 350,  stock: 30, desc: "Hilo multicolor trenzado, ideal verano",           img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80", variants: ["Ajustable"] },
    { id: 24, name: "Flor Dorada",            price: 480,  stock: 0,  desc: "Dije floral con baño de oro y perla",              img: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&q=80", variants: ["22cm","24cm"] },
  ],
};
