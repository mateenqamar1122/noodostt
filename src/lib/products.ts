export type FlavorSlug = "chicken" | "beef" | "spicy";

export type Flavor = {
  slug: FlavorSlug;
  name: string;
  tagline: string;
  world: string;
  description: string;
  cta: string;
  colorVar: string;
  bgClass: string;
  textClass: string;
  buttonClass: string;
  shadowUtil: string;
  characterImg: string;
  worldImg: string;
};

export type Product = {
  slug: string;
  flavor: FlavorSlug;
  name: string;
  blurb: string;
  price: number;
  image: string;
  badge?: string;
  comingSoon?: boolean;
};

import captainChickenImg from "@/assets/captain-chicken.png";
import beefBossImg from "@/assets/beef-boss.png";
import spicyRocketImg from "@/assets/spicy-rocket.png";
import worldChickenImg from "@/assets/world-chicken.jpg";
import worldBeefImg from "@/assets/world-beef.jpg";
import worldSpicyImg from "@/assets/world-spicy.jpg";
import productSpicyImg from "@/assets/product-spicy.png";
// import noodostChickenAsset from "@/assets/noodost-spicy-chicken.png.asset.json";
// import noodostBeefAsset from "@/assets/noodost-spicy-beef.png.asset.json";
import noodostChickenAsset from "@/assets/noodost-spicy-chicken.png";
import noodostBeefAsset from "@/assets/noodost-spicy-beef.png";
import chickenFlavorAsset from "@/assets/noodost-chicken-flavor.png";
import spicyCurryAsset from "@/assets/noodost-spicy-curry.png";
import beefFlavorAsset from "@/assets/noodost-beef-flavor.png";

export const FLAVORS: Record<FlavorSlug, Flavor> = {
  chicken: {
    slug: "chicken",
    name: "Captain Chicken",
    tagline: "Golden Harvest",
    world: "Sunny Wheat Fields",
    description: "Friendly, cheerful, and warm. A classic comfort hug in a bowl — perfect for the littlest explorers.",
    cta: "Visit the Farm",
    colorVar: "chicken",
    bgClass: "bg-chicken-soft",
    textClass: "text-chicken-dark",
    buttonClass: "bg-chicken text-ink chunky-shadow-chicken",
    shadowUtil: "chunky-shadow-chicken",
    characterImg: captainChickenImg,
    worldImg: worldChickenImg,
  },
  beef: {
    slug: "beef",
    name: "Beef Boss",
    tagline: "Mountain Ranch",
    world: "Red Ridge Ranch",
    description: "Bold, premium, and confident. Deep savory flavor for serious slurpers and big appetites.",
    cta: "Climb the Ranch",
    colorVar: "beef",
    bgClass: "bg-beef-soft",
    textClass: "text-beef",
    buttonClass: "bg-beef text-white chunky-shadow-beef",
    shadowUtil: "chunky-shadow-beef",
    characterImg: beefBossImg,
    worldImg: worldBeefImg,
  },
  spicy: {
    slug: "spicy",
    name: "2X Spicy Rocket",
    tagline: "Volcano Blast",
    world: "Lava Island",
    description: "Energetic, fiery, and playful. Launches your taste buds straight to flavor space.",
    cta: "Blast Off",
    colorVar: "spicy",
    bgClass: "bg-spicy-soft",
    textClass: "text-spicy",
    buttonClass: "bg-spicy text-white chunky-shadow-spicy",
    shadowUtil: "chunky-shadow-spicy",
    characterImg: spicyRocketImg,
    worldImg: worldSpicyImg,
  },
};

export const FLAVOR_LIST: Flavor[] = [FLAVORS.chicken, FLAVORS.beef, FLAVORS.spicy];

export const PRODUCTS: Product[] = [
  { slug: "spicy-chicken-noodles", flavor: "chicken", name: "Spicy Chicken Noodles", blurb: "Instant rich chicken flavour noodles — ready in 3 minutes. 80g pack.", price: 80, image: noodostChickenAsset, badge: "Most Loved" },
  { slug: "spicy-beef-noodles", flavor: "beef", name: "Spicy Beef Noodles", blurb: "Instant rich beef flavour noodles — ready in 3 minutes. 80g pack.", price: 80, image: noodostBeefAsset, badge: "New" },
  // { slug: "chicken-family-pack", flavor: "chicken", name: "Spicy Chicken Family Pack", blurb: "A family-size bundle of our chicken noodles.", price: 280, image: noodostChickenAsset, comingSoon: true },
  // { slug: "beef-family-pack", flavor: "beef", name: "Spicy Beef Family Pack", blurb: "Boss-level savoury noodles in a family bundle.", price: 280, image: noodostBeefAsset, comingSoon: true },
  // { slug: "rocket-fuel-cup", flavor: "spicy", name: "2X Spicy Masala Noodles", blurb: "Three-alarm spice with a smoky finish.", price: 60, image: productSpicyImg, comingSoon: true },
  // { slug: "volcano-mega-pack", flavor: "spicy", name: "Volcano Mega Pack", blurb: "Six bowls of fiery, slurpable adventure.", price: 320, image: productSpicyImg, comingSoon: true },
  { slug: "chicken-flavor-noodles", flavor: "chicken", name: "Rich Chicken Flavor Noodles", blurb: "Classic rich chicken flavour — 120g family pack. Ready in 3 minutes.", price: 80, image: chickenFlavorAsset, comingSoon: true },
  { slug: "beef-flavor-noodles", flavor: "beef", name: "Rich Beef Flavor Noodles", blurb: "Deep savoury beef flavour — 80g pack. Ready in 3 minutes.", price: 80, image: beefFlavorAsset, comingSoon: true },
  { slug: "spicy-curry-noodles", flavor: "spicy", name: "Spicy Curry Noodles 2X", blurb: "Double the heat — rich masala curry, 80g pack. Ready in 3 minutes.", price: 80, image: spicyCurryAsset, comingSoon: true },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByFlavor(flavor: FlavorSlug) {
  return PRODUCTS.filter((p) => p.flavor === flavor);
}
