<template>
	<div>
		<router-view />
	</div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
	computed: {
		...mapGetters(["authUser"]),
	},
	methods: {
		logout() {
			this.$store.dispatch("logout");
			this.$router.push({ name: "Login" });
		},
		changePassword() {
			this.$router.push({ name: "ChangePassword" });
		},
	},
};
</script>
