import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PageWrapper } from "@/components/layout/PageWrapper";

const PRODUCTS = [
  { name: "Home Jersey 2024/25", price: "R599", category: "Jerseys", description: "Official Lamontville Golden Arrows home kit in striking golden yellow and forest green." },
  { name: "Away Jersey 2024/25", price: "R599", category: "Jerseys", description: "Sleek away kit in classic white with golden accents." },
  { name: "Training Kit", price: "R350", category: "Training", description: "Performance training kit worn by the first team squad in daily sessions." },
  { name: "Club Cap", price: "R180", category: "Accessories", description: "Official Golden Arrows cap with embroidered club crest." },
  { name: "Supporters Scarf", price: "R120", category: "Accessories", description: "Thick knitted scarf in club colours. Perfect for match days." },
  { name: "Club Hoodie", price: "R450", category: "Clothing", description: "Premium golden arrows hoodie with chest crest embroidery." },
  { name: "Match Programme", price: "R30", category: "Memorabilia", description: "Official match day programme with squad info and features." },
  { name: "Club Mug", price: "R90", category: "Memorabilia", description: "Start your morning like a true Arrow with our club mug." },
];

export default function Shop() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Official Merchandise"
        title="Club"
        highlight="Shop"
        description="Show your support with official Lamontville Golden Arrows merchandise."
      />

      <PageWrapper page="shop">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-10 flex items-center gap-4">
          <div className="text-primary text-2xl font-display font-bold">!</div>
          <p className="text-sm text-muted-foreground">
            Online shop coming soon. Visit the club offices at Princess Magogo Stadium or contact us to purchase merchandise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-colors group"
            >
              <div className="aspect-square bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center relative">
                <div className="font-display font-black text-6xl text-primary/20">GA</div>
                <div className="absolute top-3 left-3 bg-primary text-black text-xs font-bold px-2 py-0.5 rounded uppercase">{product.category}</div>
                <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-base mb-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-xl text-primary">{product.price}</span>
                  <button className="flex items-center gap-2 bg-primary text-black text-xs font-bold px-3 py-2 rounded uppercase tracking-wider hover:bg-primary/90 transition-colors">
                    <ShoppingCart className="h-3 w-3" />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </PageWrapper>
    </div>
  );
}
