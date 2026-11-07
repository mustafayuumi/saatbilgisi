const turkishLower = (value) => value.toLocaleLowerCase("tr-TR");

function setupSearch({
  inputId,
  gridId,
  emptyId,
  countId,
  filters = [],
  itemSelector,
  countLabel,
}) {
  const input = document.getElementById(inputId);
  const grid = document.getElementById(gridId);
  const emptyState = document.getElementById(emptyId);
  const count = document.getElementById(countId);
  const items = [...grid.querySelectorAll(itemSelector)];
  const filterControls = filters.map(({ id, attribute }) => ({
    control: document.getElementById(id),
    attribute,
  }));

  const update = () => {
    const query = turkishLower(input.value.trim());
    let visibleCount = 0;

    for (const item of items) {
      const searchableText = turkishLower(
        `${item.textContent} ${item.dataset.search ?? ""}`,
      );
      const matchesQuery = !query || searchableText.includes(query);
      const matchesFilters = filterControls.every(({ control, attribute }) => {
        const selectedValue = control.value;
        if (!selectedValue) return true;
        if (attribute === "reserve") {
          if (selectedValue === "medium") {
            const hours = Number(item.dataset.reserveHours);
            return hours > 0 && hours < 40;
          }
          if (selectedValue === "long") {
            return Number(item.dataset.reserveHours) >= 40;
          }
        }
        return item.dataset[attribute] === selectedValue;
      });

      item.hidden = !(matchesQuery && matchesFilters);
      if (!item.hidden) visibleCount += 1;
    }

    emptyState.hidden = visibleCount !== 0;
    count.textContent = `${visibleCount} / ${items.length} ${countLabel}`;
  };

  input.addEventListener("input", update);
  for (const { control } of filterControls) {
    control.addEventListener("change", update);
  }
  update();
}

setupSearch({
  inputId: "movement-search",
  gridId: "movement-grid",
  emptyId: "movement-empty",
  countId: "movement-count",
  itemSelector: ".movement-card",
  countLabel: "mekanizma gösteriliyor",
  filters: [
    { id: "origin-filter", attribute: "origin" },
    { id: "reserve-filter", attribute: "reserve" },
    { id: "brand-filter", attribute: "brand" },
    { id: "maker-filter", attribute: "maker" },
  ],
});

setupSearch({
  inputId: "complication-search",
  gridId: "complication-grid",
  emptyId: "complication-empty",
  countId: "complication-count",
  itemSelector: ".complication-card",
  countLabel: "komplikasyon gösteriliyor",
});
