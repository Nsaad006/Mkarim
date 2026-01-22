import fs from 'fs';
import path from 'path';

export type Status = 'ACTIVE' | 'INACTIVE' | 'DRAFT';

export interface Category {
    id: string;
    name: string;
    slug: string;
    active: boolean;
    status: Status;
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Admin {
    id: string;
    email: string;
    password: string; // hashed in real db, but for mock we can store plain or hashed
    name: string;
    role: string;
    active: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    categoryId: string;
    inStock: boolean;
    quantity: number;
    badge?: string | null;
    specs: string[];
    active: boolean;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
    category?: Category;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product?: Product;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    phone: string;
    city: string;
    address: string;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
    total: number;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItem[];
}

export interface City {
    id: string;
    name: string;
    shippingFee: number;
    deliveryTime: string;
    active: boolean;
}

export interface GlobalSettings {
    storeName: string;
    storeAvailability: boolean;
    codEnabled: boolean;
    whatsappNumber: string;
    currency: string;

    // Hero Section
    heroImage?: string;
    heroSubtitle?: string;
    heroTitle?: string;
    heroDescription?: string;
    heroPrimaryBtnText?: string;
    heroPrimaryBtnLink?: string;
    heroSecondaryBtnText?: string;
    heroSecondaryBtnLink?: string;

    // Category Section
    categoriesTitle?: string;
    categoriesSubtitle?: string;

    // Featured Products Section
    featuredTitle?: string;
    featuredSubtitle?: string;

    // Why Choose Us Section
    whyTitle?: string;
    whySubtitle?: string;

    // CTA Section
    ctaTitle?: string;
    ctaSubtitle?: string;
    ctaPrimaryBtnText?: string;
    ctaPrimaryBtnLink?: string;
    ctaSecondaryBtnText?: string;
    ctaSecondaryBtnLink?: string;

    updatedAt: Date;
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    status: 'NEW' | 'READ' | 'REPLIED';
    createdAt: Date;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    createdAt: Date;
}

const DATA_FILE = path.join(__dirname, '../data.json');

class MockDB {
    products: Product[] = [];
    orders: Order[] = [];
    cities: City[] = [];
    categories: Category[] = [];
    admins: Admin[] = [];
    customers: Customer[] = [];
    contacts: Contact[] = [];
    settings: GlobalSettings = {
        storeName: "MKARIM",
        storeAvailability: true,
        codEnabled: true,
        whatsappNumber: "+212600000000",
        currency: "DH",

        // Hero Section Defaults
        heroSubtitle: "🎮 Solutions Gaming & IT au Maroc",
        heroTitle: "PC & Gaming de Qualité",
        heroDescription: "PCs haute performance & accessoires gaming. Payez à la livraison partout au Maroc.",
        heroPrimaryBtnText: "Commander Maintenant",
        heroPrimaryBtnLink: "/products",
        heroSecondaryBtnText: "Découvrir les Produits",
        heroSecondaryBtnLink: "/products",

        // Category Section Defaults
        categoriesTitle: "Nos Catégories",
        categoriesSubtitle: "Découvrez notre large sélection de produits IT et gaming de qualité supérieure",

        // Featured Products Defaults
        featuredTitle: "Produits Populaires",
        featuredSubtitle: "Découvrez nos meilleures ventes et produits les plus appréciés",

        // Why Choose Us Defaults
        whyTitle: "Pourquoi Choisir MKARIM SOLUTION ?",
        whySubtitle: "La confiance de milliers de clients au Maroc",

        // CTA Section Defaults
        ctaTitle: "Prêt à Équiper Votre Setup ?",
        ctaSubtitle: "Commandez maintenant et recevez votre matériel chez vous. Paiement à la livraison, sans risque.",
        ctaPrimaryBtnText: "Découvrir les Produits",
        ctaPrimaryBtnLink: "/products",
        ctaSecondaryBtnText: "Nous Contacter",
        ctaSecondaryBtnLink: "/contact",

        updatedAt: new Date()
    };

    constructor() {
        this.load();
    }

    private load() {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
                this.categories = (data.categories || []).map((c: Category) => ({
                    ...c,
                    createdAt: new Date(c.createdAt),
                    updatedAt: new Date(c.updatedAt)
                }));
                this.products = (data.products || []).map((p: Product) => ({
                    ...p,
                    createdAt: new Date(p.createdAt),
                    updatedAt: new Date(p.updatedAt)
                }));
                this.orders = (data.orders || []).map((o: Order) => ({
                    ...o,
                    createdAt: new Date(o.createdAt),
                    updatedAt: new Date(o.updatedAt),
                    items: (o.items || []).map((item: OrderItem) => ({
                        ...item,
                        product: this.products.find(p => p.id === item.productId)
                    }))
                }));
                this.cities = data.cities || [];
                if (data.settings) {
                    this.settings = {
                        ...this.settings,
                        ...data.settings,
                        updatedAt: new Date(data.settings.updatedAt)
                    };
                }
                this.admins = data.admins || [
                    {
                        id: 'admin-1',
                        email: 'admin@mkarim.ma',
                        password: 'password123',
                        name: 'Admin Principal',
                        role: 'super_admin',
                        active: true
                    }
                ];
                this.customers = (data.customers || []).map((c: Customer) => ({
                    ...c,
                    createdAt: new Date(c.createdAt)
                }));
                this.contacts = (data.contacts || []).map((c: Contact) => ({
                    ...c,
                    createdAt: new Date(c.createdAt)
                }));
            } else {
                this.seed();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.seed();
        }
    }

    private seed() {
        this.categories = [
            { id: 'laptops', name: 'PC Portable', slug: 'laptops', active: true, status: 'ACTIVE', icon: 'Laptop', createdAt: new Date(), updatedAt: new Date() },
            { id: 'desktops', name: 'PC de Bureau', slug: 'desktops', active: true, status: 'ACTIVE', icon: 'Cpu', createdAt: new Date(), updatedAt: new Date() },
            { id: 'gaming-pc', name: 'PC Gamer', slug: 'gaming-pc', active: true, status: 'ACTIVE', icon: 'Gamepad2', createdAt: new Date(), updatedAt: new Date() },
            { id: 'monitors', name: 'Moniteurs', slug: 'monitors', active: true, status: 'ACTIVE', icon: 'Monitor', createdAt: new Date(), updatedAt: new Date() },
            { id: 'gaming-monitors', name: 'Écrans Gamer', slug: 'gaming-monitors', active: true, status: 'ACTIVE', icon: 'Tv', createdAt: new Date(), updatedAt: new Date() },
            { id: 'gaming-mice', name: 'Souris Gamer', slug: 'gaming-mice', active: true, status: 'ACTIVE', icon: 'Mouse', createdAt: new Date(), updatedAt: new Date() },
            { id: 'gaming-keyboards', name: 'Claviers Gamer', slug: 'gaming-keyboards', active: true, status: 'ACTIVE', icon: 'Keyboard', createdAt: new Date(), updatedAt: new Date() },
            { id: 'gaming-headsets', name: 'Casques Gamer', slug: 'gaming-headsets', active: true, status: 'ACTIVE', icon: 'Headset', createdAt: new Date(), updatedAt: new Date() },
            { id: 'gaming-accessories', name: 'Accessoires Gamer', slug: 'gaming-accessories', active: true, status: 'ACTIVE', icon: 'Gamepad2', createdAt: new Date(), updatedAt: new Date() },
            { id: 'earphones', name: 'AirPods & Écouteurs', slug: 'earphones', active: true, status: 'ACTIVE', icon: 'Bluetooth', createdAt: new Date(), updatedAt: new Date() },
            { id: 'it-accessories', name: 'Accessoires IT', slug: 'it-accessories', active: true, status: 'ACTIVE', icon: 'Cable', createdAt: new Date(), updatedAt: new Date() },
            { id: 'electronics', name: 'Électronique', slug: 'electronics', active: true, status: 'ACTIVE', icon: 'Zap', createdAt: new Date(), updatedAt: new Date() },
        ];
        this.products = [
            {
                id: '1',
                name: 'PC Gamer MKARIM Pro RTX 4070',
                description: 'PC Gaming haute performance',
                price: 18999,
                image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600',
                categoryId: 'gaming-pc',
                inStock: true,
                quantity: 50,
                specs: ['RTX 4070', '32GB RAM'],
                active: true,
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        this.cities = [
            { id: '1', name: 'Casablanca', shippingFee: 20, deliveryTime: '24h', active: true },
            { id: '2', name: 'Rabat', shippingFee: 25, deliveryTime: '24h', active: true },
        ];
        this.admins = [
            {
                id: 'admin-1',
                email: 'admin@mkarim.ma',
                password: 'password123',
                name: 'Admin Principal',
                role: 'super_admin',
                active: true
            }
        ];
        this.save();
    }

    save() {
        try {
            const data = {
                products: this.products,
                orders: this.orders,
                cities: this.cities,
                categories: this.categories,
                settings: this.settings,
                admins: this.admins,
                customers: this.customers,
                contacts: this.contacts
            };
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
}

export const mockDb = new MockDB();
