<script setup>
import TextBox from "@/components/TextBox.vue";
import ButtonFilled from "@/components/ButtonFilled.vue";
import SuccessMessage from "@/components/SuccessMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

import SaveIcon from "~icons/fluent/save-16-regular";

import reservationAPI from "@/services/reservationAPI";

import { ref } from "vue";

const reservation = ref({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  resDate: "",
  resTime: "",
  people: "",
});

const validationErrors = ref(null);
const isSuccessful = ref(false);
const generalError = ref(null);

const registerReservation = async () => {
  isSuccessful.value = false;
  validationErrors.value = null;
  generalError.value = null;
  try {
    const res = await reservationAPI.registerReservation(reservation.value);
    console.log(res);
    isSuccessful.value = true;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.data) {
      generalError.value = err.response.data.message;
      validationErrors.value = err.response.data.errors;
    }
  }
};
</script>

<template>
  <div class="main-wrapper">
    <div class="header">
      <h1>Nova Reserva</h1>
    </div>
    <div class="form-wrapper">
      <form @submit.prevent="registerReservation">
        <div class="textBox-group">
          <TextBox
            text-box-type="text"
            id="firstName"
            label-text="Primeiro nome"
            placeholder-text="Ponha seu primeiro nome..."
            :errors="validationErrors"
            v-model:input="reservation.firstName"
          />
          <TextBox
            text-box-type="text"
            id="lastName"
            label-text="Sobrenome"
            placeholder-text="Ponha seu sobrenome..."
            :errors="validationErrors"
            v-model:input="reservation.lastName"
          />
        </div>
        <TextBox
          text-box-type="text"
          id="phone"
          label-text="Número"
          placeholder-text="Coloque seu número..."
          :errors="validationErrors"
          v-model:input="reservation.phone"
        />
        <TextBox
          text-box-type="email"
          id="email"
          label-text="Endereço de E-mail"
          placeholder-text="Coloque seu endereço de e-mail..."
          :errors="validationErrors"
          v-model:input="reservation.email"
        />
        <div class="textBox-group">
          <TextBox
            text-box-type="date"
            id="resDate"
            label-text="Data de Reserva"
            placeholder-text="Ponha a data de reserva..."
            :errors="validationErrors"
            v-model:input="reservation.resDate"
          />
          <TextBox
            text-box-type="time"
            id="resTime"
            label-text="Tempo de reserva"
            placeholder-text="Ponha o tempo de reserva..."
            :errors="validationErrors"
            v-model:input="reservation.resTime"
          />
        </div>
        <TextBox
          text-box-type="text"
          id="people"
          label-text="Número de pessoas"
          placeholder-text="Ponha o número de pessoas..."
          :errors="validationErrors"
          v-model:input="reservation.people"
        />
        <SuccessMessage
          :is-successful="isSuccessful"
          success-message="Reserva registrada com sucesso"
        />
        <ErrorMessage
          :error-flag="generalError"
          :error-message="generalError"
        />
        <ButtonFilled class="button" text="Confirmar">
          <template #icon><SaveIcon /></template>
        </ButtonFilled>
      </form>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 200px;
  background: var(--lighter-gray)
    url("@/assets/images/new-reservation-header.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.header h1 {
  margin-left: var(--x-spacing-mobile);
  margin-bottom: 15px;
  font-size: 35px;
  color: var(--snow-white);
  text-shadow: 1px 1px 2px var(--primary-black);
}
.form-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 50px;
  margin-left: var(--x-spacing-mobile);
  margin-right: var(--x-spacing-mobile);
  align-items: center;
  background-color: var(--primary-white);
  padding: 20px 20px;
  border: 1px solid var(--primary-black);
  border-radius: 10px;
}
form {
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.textBox-group {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0px;
}
.button {
  width: 200px;
}

@media screen and (min-width: 1024px) {
  .form-wrapper {
    margin: 50px var(--x-spacing-desktop) var(--x-spacing-desktop) 50px;
  }
  .header h1 {
    margin-left: var(--x-spacing-desktop);
    font-size: 45px;
    margin-bottom: 20px;
  }
  .textBox-group {
    flex-direction: row;
    gap: 10px;
  }
}
</style>
