import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowLeft, Search, Loader2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MarketItem {
  crop: string;
  market: string;
  price: number;
  change: number;
  trend: string;
  date?: string;
}

const locationData: Record<string, { key: string, districts: { name: string, key: string }[] }> = {
  "Odisha": { 
    key: "state.odisha", 
    districts: [
      { name: "Cuttack", key: "dist.cuttack" },
      { name: "Khordha", key: "dist.khordha" },
      { name: "Sambalpur", key: "dist.sambalpur" },
      { name: "Balasore", key: "dist.balasore" },
      { name: "Bhubaneswar", key: "dist.bhubaneswar" },
      { name: "Puri", key: "dist.puri" },
      { name: "Ganjam", key: "dist.ganjam" },
      { name: "Malkangiri", key: "dist.malkangiri" }
    ]
  },
  "Maharashtra": {
    key: "state.maharashtra",
    districts: [
      { name: "Pune", key: "dist.pune" },
      { name: "Nashik", key: "dist.nashik" },
      { name: "Nagpur", key: "dist.nagpur" },
      { name: "Mumbai", key: "dist.mumbai" },
      { name: "Satara", key: "dist.satara" },
      { name: "Jalgaon", key: "dist.jalgaon" }
    ]
  },
  "Uttar Pradesh": {
    key: "state.up",
    districts: [
      { name: "Agra", key: "dist.agra" },
      { name: "Aligarh", key: "dist.aligarh" },
      { name: "Prayagraj", key: "dist.prayagraj" },
      { name: "Varanasi", key: "dist.varanasi" },
      { name: "Lucknow", key: "dist.lucknow" }
    ]
  },
  "Punjab": {
    key: "state.punjab",
    districts: [
      { name: "Ludhiana", key: "dist.ludhiana" },
      { name: "Amritsar", key: "dist.amritsar" },
      { name: "Jalandhar", key: "dist.jalandhar" },
      { name: "Patiala", key: "dist.patiala" }
    ]
  },
  "Gujarat": {
    key: "state.gujarat",
    districts: [
      { name: "Ahmedabad", key: "dist.ahmedabad" },
      { name: "Surat", key: "dist.surat" },
      { name: "Rajkot", key: "dist.rajkot" },
      { name: "Vadodara", key: "dist.vadodara" }
    ]
  }
};

const MarketPrices = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
        let url = `${baseUrl}/api/market-prices`;
        const params = new URLSearchParams();
        if (selectedState) params.append("state", selectedState);
        if (selectedDistrict) params.append("district", selectedDistrict);
        
        const q = params.toString();
        if (q) url += `?${q}`;

        const response = await fetch(url);
        const json = await response.json();
        if (json.success && json.data) {
          setMarketData(json.data);
        } else {
          setMarketData(getStaticData());
        }
      } catch (error) {
        console.error("Failed to fetch market prices:", error);
        setMarketData(getStaticData());
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedDistrict]);

  const getStaticData = (): MarketItem[] => [
    { crop: t("crop.rice"), market: "Cuttack Mandi (Mock)", price: 2150, change: 3.2, trend: "up" },
    { crop: t("crop.wheat"), market: "Sambalpur Mandi (Mock)", price: 2340, change: -1.5, trend: "down" },
    { crop: t("crop.mustard"), market: "Balasore Mandi (Mock)", price: 5200, change: 5.1, trend: "up" },
    { crop: t("crop.onion"), market: "Bhubaneswar Mandi (Mock)", price: 1800, change: -8.3, trend: "down" },
    { crop: t("crop.tomato"), market: "Puri Mandi (Mock)", price: 2600, change: 12.0, trend: "up" },
    { crop: t("crop.potato"), market: "Cuttack Mandi (Mock)", price: 1200, change: 0.5, trend: "up" },
    { crop: t("crop.greenGram"), market: "Berhampur Mandi (Mock)", price: 7100, change: 2.8, trend: "up" },
    { crop: t("crop.sugarcane"), market: "Balasore Mandi (Mock)", price: 350, change: -0.3, trend: "down" },
  ];

  const sortedAndFiltered = marketData
    .filter(
      (entry) =>
        entry.crop.toLowerCase().includes(search.toLowerCase()) ||
        entry.market.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "price-high-low") return b.price - a.price;
      if (sortBy === "price-low-high") return a.price - b.price;
      if (sortBy === "change-high-low") return b.change - a.change;
      return 0;
    });

  return (
    <div className="min-h-screen bg-mesh pb-28">
      <div className="glass-card border-b border-white/30 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t("market.title")}
            </h1>
            <p className="text-xs font-body text-muted-foreground">{t("market.subtitle")}</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("market.search")}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-2 border-border text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex gap-2">
            <select 
              value={selectedState} 
              onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(""); }}
              className="flex-1 px-3 py-2.5 rounded-xl bg-muted border-2 border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">{t("market.all_states") || "All States"}</option>
              {Object.entries(locationData).map(([name, data]) => (
                <option key={name} value={name}>{t(data.key)}</option>
              ))}
            </select>

            <select 
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedState}
              className="flex-1 px-3 py-2.5 rounded-xl bg-muted border-2 border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            >
              <option value="">{t("market.all_districts") || "All Districts"}</option>
              {selectedState && locationData[selectedState].districts.map(dist => (
                <option key={dist.name} value={dist.name}>{t(dist.key)}</option>
              ))}
            </select>
          </div>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-muted border-2 border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="recommended">Sort by: Recommended</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="change-high-low">Top Gainers</option>
          </select>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-body text-muted-foreground">{t("market.loading") || "Fetching live mandi prices..."}</p>
          </div>
        ) : sortedAndFiltered.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm font-body text-muted-foreground">No markets found for "{search}"</p>
          </div>
        ) : (
          sortedAndFiltered.map((item, i) => (
          <motion.div
            key={item.crop + item.market}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card border border-amber-900/10 rounded-2xl p-4 flex items-center justify-between card-hover-glow shadow-card"
          >
            <div>
              <p className="font-display font-bold text-foreground">{item.crop}</p>
              <p className="text-xs font-body text-muted-foreground">{item.market}</p>
              {item.date && (
                <p className="text-[10px] font-body text-muted-foreground/70 mt-1">
                  Updated: {item.date}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-lg text-foreground">₹{item.price.toLocaleString()}</p>
              <div
                className={`flex items-center gap-1 text-sm font-display font-semibold ${
                  item.trend === "up" ? "text-primary" : "text-destructive"
                }`}
              >
                {item.trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {item.change > 0 ? "+" : ""}
                {item.change}%
              </div>
            </div>
          </motion.div>
        )))}
      </div>

      <BottomNav />
    </div>
  );
};

export default MarketPrices;
