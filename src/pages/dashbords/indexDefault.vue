<template>
    <div class="container-fluid default-dashboard">
        <div class="row widget-grid">
            <WelcomeView />
            <OpeningLeaflets doller="$" col="col-xl-3 col-md-6 proorder-xl-2 proorder-md-2" />
            <ShiftsOverview />
            <ProjectData />
            <CustomerTransaction />
            <NotificationsData />
            <AppointmentsData col="col-xxl-5 col-xl-6 box-col-6 proorder-xl-7 proorder-md-8"
                bodyclass="appointments relative" />
            <ActiveMembers />
            <SalesStatistic />
            <SaleProduct />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
const WelcomeView = defineAsyncComponent(() => import("@/components/theme/dashboards/default/WelcomeView.vue"))
const OpeningLeaflets = defineAsyncComponent(() => import("@/components/common/OpeningLeaflets.vue"))
const ShiftsOverview = defineAsyncComponent(() => import("@/components/theme/dashboards/default/ShiftsOverview.vue"))
const CustomerTransaction = defineAsyncComponent(() => import("@/components/theme/dashboards/default/CustomerTransaction.vue"))
const NotificationsData = defineAsyncComponent(() => import("@/components/theme/dashboards/default/NotificationsData.vue"))
const AppointmentsData = defineAsyncComponent(() => import("@/components/common/AppointmentsData.vue"))
const ActiveMembers = defineAsyncComponent(() => import("@/components/theme/dashboards/default/ActiveMembers.vue"))
const SalesStatistic = defineAsyncComponent(() => import("@/components/theme/dashboards/default/SalesStatistic.vue"))
const SaleProduct = defineAsyncComponent(() => import("@/components/theme/dashboards/default/SaleProduct.vue"))
const ProjectData = defineAsyncComponent(() => import("@/components/theme/dashboards/default/ProjectData.vue"))
</script>

  