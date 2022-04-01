<template>
	<div class="container">
		<div class="row mt-5 justify-content-center">
			<div class="col-4">
				<div class="card card-outline card-primary">
					<div class="card-header text-center">
						<a class="h1">Bemo</a>
					</div>
					<div class="card-body">
						<p>Sign in to start your session</p>

						<form @submit.prevent="login">
							<div class="input-group mb-3">
								<input
									v-model="email"
									type="email"
									name="email"
									class="form-control"
									placeholder="Email"
								/>
								<span
									v-if="isSubmited && email.length == 0"
									class="error invalid-feedback"
									>Email is required</span
								>
							</div>
							<div class="input-group mb-3">
								<input
									v-model="password"
									type="password"
									name="password"
									class="form-control"
									placeholder="Password"
								/>
								<span
									v-if="isSubmited && password.length == 0"
									class="error invalid-feedback"
									>Password is required</span
								>
							</div>
							<span
								v-if="isInvalidCredentials"
								class="error invalid-feedback d-block mb-3"
								>Invalid credentials</span
							>
							<div class="row">
								<div class="col">
									<button
										type="submit"
										class="btn btn-primary btn-block"
									>
										Sign In
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			email: "",
			password: "",
			isInvalidCredentials: false,
			isSubmited: false,
		};
	},
	methods: {
		login() {
			this.isSubmited = true;
			this.axios
				.post(this.$baseUrl + "api/login", {
					email: this.email,
					password: this.password,
				})
				.then((response) => {
					let data = {
						email: this.email,
						token: response.data.access_token,
					};
					localStorage.setItem("bemo-user", JSON.stringify(data));
					this.$store.dispatch("setUser", data);
					this.$router.push({ name: "Dashboard" });
				})
				.catch((error) => {
					this.isInvalidCredentials = true;
					console.log(error);
				});
		},
	},
};
</script>