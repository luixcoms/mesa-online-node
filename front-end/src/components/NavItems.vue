<script setup>
import NavItem from "@/components/NavItem.vue";

import FoodIcon from "~icons/fluent/food-16-filled";
import CardListIcon from "~icons/bi/card-list";
import SearchIcon from "~icons/ant-design/search-outlined";
import PlusIcon from "~icons/akar-icons/plus";
</script>

<template>
  <div class="nav-items">
    <NavItem route-name="reservations" text="Reservas">
      <template #icon>
        <CardListIcon />
      </template>
    </NavItem>
    <NavItem route-name="new-reservation" text="Nova Reserva">
      <template #icon>
        <FoodIcon />
      </template>
    </NavItem>
    <NavItem route-name="search" text="Busca">
      <template #icon>
        <SearchIcon />
      </template>
    </NavItem>
    <NavItem route-name="add-table" text="Nova Mesa">
      <template #icon>
        <PlusIcon />
      </template>
    </NavItem>
  </div>
</template>

<style scoped>
.nav-items {
  display: flex;
  font-family: "Inter", sans-serif;
  font-weight: normal;
  justify-content: space-around;
  gap: 20px;
  align-items: center;
}
@media screen and (min-width: 1024px) {
  .nav-items {
    gap: 35px;
  }
}
</style>
