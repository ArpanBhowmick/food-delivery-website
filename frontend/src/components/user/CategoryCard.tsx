import { useState, useMemo } from "react";
import { LayoutGrid } from "lucide-react";
import { ITEM_CATEGORIES } from "@/schema/itemSchema";
import type { IItem } from "@/types/item.types";

type ItemCategory = (typeof ITEM_CATEGORIES)[number];

interface CategoryMeta {
  name: string;
  subtitle: string;
  imageUrl: string;
}

const CATEGORY_META: Record<ItemCategory, CategoryMeta> = {
  Snacks: {
    name: "Snacks",
    subtitle: "Crispy bites",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMiPczNvaPKNK-ONNyZ6YI3ERmTFNlDrvRRY1cb3iieTHvKlqrQOzXz4veqtd9YoiysG80svPdNMPPM3lMTVpRBphHMn1t9r_FgkTTBRmU2b5HTvkyEDV0dFQc3n2usXXKUEq3NqHf-KVzPi7hwAP-sqXgiJkuc16i1jzAYuT_qI-EEbvfsgI2Yt4qcUsxg6DkafW0mPDCCixpKt2PfWft2GQVx6EZIy60tLUPdzvsLr28vTX5lM2C",
  },
  "Main Courses": {
    name: "Main Courses",
    subtitle: "Chef specials",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbLkayerex5PsBVJuotceQ_RNB9J--G41JR1_xoO3C8fLBQtxYn1a-iFzT0Xcw_m4b-p8QckPbRxFVb_UsZHEOE2-ueXmcHn21E9aOxmoC6w9HSXybDD3Bau08qxGKe-GB7aoDeHeL_evTHN78R0iX1caSrk5rA43zc5BDhwwaUxeoJ_IV37PJTTPeiDgOY79r0Y-axZ_Ue0PI1maqWs5-lc6H2xCPqXiKWKFCaIDG0Kkna4Cnumzu",
  },
  Desserts: {
    name: "Desserts",
    subtitle: "Sweet bakes",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcfrAxSGqy4xBMTuEAqOIB5RVO9tWuJwF3xgP2W-ou83D9fyNk2lm0YdARJgH9hJAmDbCG7E-nwR6WSyQwhAC9SweH8P93XnrSCxiDvYrzc1q2x5hTcZUIcvJQribPJzL9JxBI5v_OHGSkyfYPalen5Q8CFldTpHRJ5umG7hSvC5reIesF7g3Z6eRrjGOgL0nTjwZi8R7ALmmL3y-rSTEe_Lpx-XLK9ZKjpALnP5FsAeQrGBN5XZQV",
  },
  Pizza: {
    name: "Pizza",
    subtitle: "Wood-fired",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPYSO5M3JcmeHMMexFwTYcf4QmpFyel8FABJ9z04DzlB024YVepV0jwD-aSMKngih1x1vD5-ECsErnbqr3ohLlo1ZibrmdP8zwVajarmbCW6eza_btkRtN5u8hPWBG8sV9DX7LvgBB2aTOTmOamkrhyxAEWLpLafjnFtwZ3wdv0y8Eet7DhqJIeM5iGZEZMn5vo5lYtsroA7GNCaANa1lSf0n0re-f4rhaRJw8YUhdkg3BxUhly6Px",
  },
  Burgers: {
    name: "Burgers",
    subtitle: "Hand-smashed",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGBKMkr9rjf7jtL49j-v73uJUYm7_O-n0iUqdUV8dZ9e6UXb8MICQRl1_pDEQQi9u1tNQlfSIf5yjrtAuyOwz5GxWDjroykC2lT-tGv2XQiQgRBuS-nNW4vd1qGboA_qZ-rnrZmkmVQpKFakJYe-AC5mTLmhNeZa9VsXlltpXJ_sk380Oo45lD9MfMUnNYZ1Nhsa-jmIKd-aaPYWb1zQ_2ujOBR8crvuVgL4VItv3wTkfT5lk2_3GR",
  },
  Sandwiches: {
    name: "Sandwiches",
    subtitle: "Artisan deli",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDA51HMJTUHpwpzTFe9PjyKJKWxuArECbtXR-xnJqfJcW2QINMdYh4K0QSSB-a1YuBXv2hyis3ciRw7Q0jY44IoxvcOvxsEvUTEM7mRMm7Q8zZtUIXTxSbbNHjUubvvk8hcyE4hllAsAhr4gLjzhNAvB3iqAZOR4l8ccPxjKaox_yX9nURdKe2ismwTsReH3lkCbn1nMTOW4OShvJKsp_s8WGTWucKbIwIDMldDxl7T5cbbroAfaclC",
  },
  "South Indian": {
    name: "South Indian",
    subtitle: "Dosa & idli",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFFo0X6Cx01qDXgh51ufh9IKAbBSdbI60O1brTKKH290Kpy-HwQsWe53-pNs8S77ysO_ZorQQbnVEV2ngehbFXFsBmRq0AU7eqpir_UCOcz4xW9BqSjZjexmrREssJNsiRAjav8g5YukYln0Xc3HpGO8XsmOp14mszQuzXo1hd23YKxAT8wFSCnNmUKMic2rUtNHUgLr9ydS4i3WcKtRkibnFKOqNNURiY8VHq2EpRBTKn1afxF4SD",
  },
  "North Indian": {
    name: "North Indian",
    subtitle: "Curries & naan",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKbSEOdN0CcfLrWXL7roZj1K93QMs278fwwdD352WQLXjxmhB8XbxE7mD7oIo5DGZslpNvxlRK6A7ZakhJKMI_9feGKa7rW4j2k-ucRA0hhYEcM_0idz-YLpdVQypOUTpGWoGVN-DqLFgHvbo9u_aHifxDYvU2DhoGxBoReaWuChBsjovVvB9EJ2AZKZNGAPE98Gerp-Dm1KqudoQ3bjD5FKyVhr2PDbrHI1amTVLZjj6X0puJjS0m",
  },
  Chinese: {
    name: "Chinese",
    subtitle: "Wok & dim sum",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-0bJ_LM0sT48n2KAJEVSxzX-XvoAkIF5SzXoD0ouGIGsFywk9Qg8GKSoW-e0e_149AlbaQwxKv_V5bT_s3zv0JURoHXSwITo4t3bGgeSeKHic6FXvFfbflR_DW780UMr_f6SndqBOSweW1tfcvHOlh25UF8v-OTV9qIghh1LDE4RjFPCU5Hub-mG77NdPgoYcet7Z19LnwioD1kOtOZXWpmpPmVv3poKVuFZbjI_FSjxYYKcT33t2",
  },
  "Fast Food": {
    name: "Fast Food",
    subtitle: "Wings & sides",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCIEaO6U0gp_TW_A2i7YisbJBItB3k0lGzVD3QQz6PDevczopYAOlmXjkdO8rYIoYI_59SxvVUoeESEHHmH-4FmRMAKxa5Lh8NKhRQm-lfIZgrVsFCKFPHQ663veENzCVVgYBm6x3yiabBfJc0regmV1wsukXe2_oWcXHpsS2K3pCHVGfLi6PAn2cOoLP8FFN3AC_tNpwt7Jr3zCa7Aqsq6DitBBW_m_X9lJa7AacxVSviw8fQ2P1yI",
  },
  Others: {
    name: "Drinks & More",
    subtitle: "Craft brews",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDWnYYgPl5QcOIH6BRkSbk8L6Je8G4qrvQsnb78Z30_ER6K6uAJ7uxAUYf0VAKRGdd23FTjJ2cvvs5zAxfLGYs8lnPw37lUkj70mbYSapsf1A8h1NGxTFkHDWyiCahh6HgH_pwSeQRmkHlv8bTL0THVFLhjL5Z6YeE_L2qEhDjiTQm4DQbSu_CLRm9UsOZI7mLQ59qwkhYSXkgDTvjlBRBAi9ye3du-rW_av4xxwRrBoRyhhdUJsq38",
  },
};

interface CategoryItem {
  name: string;
  subtitle: string;
  imageUrl: string;
  slug: string | null;
}

interface UserCategoriesProps {
  items?: IItem[];
  categories?: string[];
  selectedCategory?: string | null;
  onSelectCategory?: (catName: string | null) => void;
  onResetFilter?: () => void;
  setSelectedCategory?: (catName: string | null) => void;
  onCategorySelect?: (catName: string | null) => void;
}

export default function CategoryCard({
  items,
  categories,
  selectedCategory,
  onSelectCategory,
  onResetFilter,
  setSelectedCategory,
  onCategorySelect,
}: UserCategoriesProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const currentCategory = selectedCategory !== undefined ? selectedCategory : internalSelected;

  const handleSelect = (catSlug: string | null) => {
    setInternalSelected(catSlug);
    if (onSelectCategory) onSelectCategory(catSlug);
    if (setSelectedCategory) setSelectedCategory(catSlug);
    if (onCategorySelect) onCategorySelect(catSlug);
  };

  const handleReset = () => {
    setInternalSelected(null);
    if (onResetFilter) {
      onResetFilter();
    } else {
      handleSelect(null);
    }
  };

  // Build the list of category cards based on item data / itemSchema
  const categoriesToDisplay = useMemo(() => {
    let sourceCategories: string[];

    if (items && items.length > 0) {
      // Derive categories from available item data
      sourceCategories = items
        .map((item) => item.category)
        .filter((cat): cat is ItemCategory => Boolean(cat));
    } else if (categories && categories.length > 0) {
      sourceCategories = categories;
    } else {
      // Default to all supported categories in itemSchema
      sourceCategories = [...ITEM_CATEGORIES];
    }

    // Deduplicate categories so each appears only once
    const uniqueCategories = Array.from(new Set(sourceCategories));

    // Preserve the ordering convention from ITEM_CATEGORIES
    uniqueCategories.sort((a, b) => {
      const indexA = (ITEM_CATEGORIES as readonly string[]).indexOf(a as ItemCategory);
      const indexB = (ITEM_CATEGORIES as readonly string[]).indexOf(b as ItemCategory);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    const cards: CategoryItem[] = uniqueCategories.map((catKey) => {
      const meta = CATEGORY_META[catKey as ItemCategory];
      return {
        name: meta?.name ?? catKey,
        subtitle: meta?.subtitle ?? "Curated bites",
        slug: catKey,
        imageUrl: meta?.imageUrl ?? CATEGORY_META.Others.imageUrl,
      };
    });

    // Keep the existing All Items option at the end of the category list
    cards.push({
      name: "All Items",
      subtitle: "View everything",
      slug: null,
      imageUrl: "",
    });

    return cards;
  }, [items, categories]);

  return (
    <section
      id="category-grid"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-[22px] font-extrabold text-[#0f172a] tracking-tight">
            Explore by Category
          </h2>
          <p className="text-[13px] text-slate-500">
            Authentic cuisines curated for every craving
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className={`inline-flex items-center justify-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            currentCategory
              ? "bg-[#6d28d9]/10 text-[#6d28d9] hover:bg-[#6d28d9]/15 border border-[#6d28d9]/20"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
          aria-label="Reset category filter"
        >
          Reset Filter
        </button>
      </div>

      {/* 2-Row Compact Responsive Grid of Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-3.5">
        {categoriesToDisplay.map((cat) => {
          const isActive = currentCategory === cat.slug;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => handleSelect(cat.slug)}
              aria-pressed={isActive}
              className={`category-pill group flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-200 text-left relative cursor-pointer shadow-xs ${
                isActive
                  ? "bg-purple-100/90 border-[#6d28d9] ring-2 ring-[#6d28d9]/25 shadow-sm"
                  : "bg-white hover:bg-purple-50/80 border border-purple-100 hover:border-purple-200/80"
              }`}
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shrink-0 shadow-xs ring-1 ${
                  isActive ? "ring-[#6d28d9]" : "ring-purple-100"
                }`}
              >
                {cat.slug === null ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50">
                    <LayoutGrid className="w-6 h-6 text-[#6d28d9]" />
                  </div>
                ) : (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`block text-[13px] md:text-[14px] truncate font-semibold transition-colors ${
                    isActive
                      ? "text-[#6d28d9] font-bold"
                      : "text-slate-700 group-hover:text-[#6d28d9]"
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-[11px] font-medium block truncate text-slate-400">
                  {cat.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
