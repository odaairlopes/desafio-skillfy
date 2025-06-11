import React from "react";
import {
  Container,
  Header,
  Title,
  SelectAllButton,
  CategoriesContainer,
  CategoryItem,
  CategoryCheckbox,
  CategoryLabel,
  CategoryIcon,
  CategoryName,
} from "./CategoryFilter.styles";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  className = "",
}) => {
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      trabalho: "💼",
      estudos: "📚",
      saúde: "🏥",
      pessoal: "👤",
      casa: "🏠",
      lazer: "🎮",
      financeiro: "💰",
    };
    return icons[category] || "📋";
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      onCategoryChange([]);
    } else {
      onCategoryChange(categories);
    }
  };

  return (
    <Container className={className}>
      <Header>
        <Title>Categorias</Title>
        <SelectAllButton onClick={handleSelectAll}>
          {selectedCategories.length === categories.length ? "Limpar" : "Todas"}
        </SelectAllButton>
      </Header>

      <CategoriesContainer>
        {categories.map((category) => (
          <CategoryItem key={category}>
            <CategoryCheckbox
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={(e) => {
                if (e.target.checked) {
                  onCategoryChange([...selectedCategories, category]);
                } else {
                  onCategoryChange(
                    selectedCategories.filter((c) => c !== category)
                  );
                }
              }}
            />
            <CategoryLabel>
              <CategoryIcon>{getCategoryIcon(category)}</CategoryIcon>
              <CategoryName>{category}</CategoryName>
            </CategoryLabel>
          </CategoryItem>
        ))}
      </CategoriesContainer>
    </Container>
  );
};

export default CategoryFilter;
