<template>
	<div class="container-fluid position-relative min-vh-100">
		<nav class="navbar navbar-light bg-light">
			<div class="container-fluid justify-content-end">
				<span class="navbar-text float-end" @click="logout">
					Logout
				</span>
			</div>
		</nav>
		<div class="row mt-4">
			<div class="col-2">
				<select class="form-select" v-model="status">
					<option value="null">All</option>
					<option value="1">Active</option>
					<option value="0">Deleted</option>
				</select>
			</div>
			<div class="col-2">
				<div class="input-group">
					<input
						type="text"
						class="form-control"
						placeholder="YYYY-mm-dd"
						v-model="dateInput"
					/>
					<span class="error d-block invalid-feedback">
						{{ showDateError ? 'invalid date' : '&nbsp;'}}
					</span>
				</div>
			</div>
			<div class="col-2">
				<button class="btn btn-primary" @click="getData">Filter</button>
			</div>
		</div>
		<div class="row row gx-4 board mt-2">
			<!-- boards -->
			<div
				class="col mt-4 border rounded-3 bg-light"
				v-for="(board, boardIndex) in boards"
				:key="boardIndex"
			>
				<!-- board label -->
				<div
					class="
						my-4
						d-flex
						justify-content-between
						align-items-center
					"
				>
					<label class="fw-bold">{{ board.name }}</label>
					<button
						type="button"
						class="btn btn-sm btn-outline-danger"
						@click="removeBoard(boardIndex)"
					>
						X
					</button>
				</div>

				<!-- cards -->
				<draggable
					v-model="board.cards"
					group="cards"
					@change="log($event, boardIndex)"
					@onUpdate="dragged"
				>
					<div
						class="mt-2 w-100 p-2 bg-white rounded-3 bemo-card"
						v-for="(card, cardIndex) in board.cards"
						:key="boardIndex + '-' + cardIndex"
						@click="openCardEditModel(boardIndex, cardIndex)"
					>
						<div
							class="
								d-flex
								justify-content-between
								align-items-center
								px-2
							"
						>
							<label>{{ card.title }}</label>
							<button
								type="button"
								class="btn-sm btn-close"
								aria-label="Close"
								@click.stop="removeCard(boardIndex, cardIndex)"
							></button>
						</div>
						<div class="px-2">
							<small>{{ card.description }}</small>
						</div>
					</div>
				</draggable>

				<!-- add new card -->
				<div class="my-4">
					<div class="input-group mt-3">
						<input
							type="text"
							class="form-control"
							placeholder="Add card"
							v-model="board.newCardTitle"
						/>
						<button
							class="btn btn-outline-secondary"
							type="button"
							@click="addNewCard(boardIndex)"
						>
							&#10003;
						</button>
					</div>
				</div>
			</div>

			<!-- add new board  -->
			<div class="col mt-4 border rounded-3">
				<div class="input-group mt-3">
					<input
						type="text"
						class="form-control"
						placeholder="New Board"
						v-model="newBoardName"
					/>
					<button
						class="btn btn-outline-secondary"
						type="button"
						@click="addNewBoard"
					>
						&#10003;
					</button>
				</div>
			</div>
		</div>
		<div style="position: absolute; bottom: 50px; right: 50px">
			<button type="button" class="btn btn-primary" @click="dumpDB">Export</button>
		</div>
		<modal name="editCardModel">
			<div class="row p-4">
				<div class="col">
					<div class="mb-3">
						<label for="editTitle" class="form-label">Title</label>
						<input
							type="text"
							class="form-control"
							id="editTitle"
							placeholder="Title"
							v-model="editCardTitle"
						/>
					</div>
					<div class="mb-3">
						<label for="editDescription" class="form-label"
							>Decription</label
						>
						<textarea
							class="form-control"
							id="editDescription"
							rows="3"
							v-model="editCardDescription"
						></textarea>
					</div>
					<div class="mb-3 d-grid gap-2">
						<button
							class="btn btn-outline-secondary"
							type="button"
							@click="saveCard()"
						>
							Update
						</button>
					</div>
				</div>
			</div>
		</modal>
	</div>
</template>
<script>
import draggable from "vuedraggable";
export default {
	components: {
		draggable,
	},
	data() {
		return {
			boards: [],
			newBoardName: "",

			editingCardIndex: null,
			editingCardBoardIndex: null,
			editCardTitle: "",
			editCardDescription: "",

			status: null,
			dateInput: "",
			showDateError: false,
		};
	},
	mounted() {
		this.getData();
	},
	computed: {
		checkDate() {
			/*eslint-disable */
			let pattern = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
			/*eslint-enable */
			let result = pattern.test(this.dateInput);
			console.log(result);
			return result;
		},
	},
	methods: {
		getData() {
			let url = this.$baseUrl + "api/list-card?status=" + this.status;

			if (this.dateInput.length > 0) {
				console.log(1);
				if (this.checkDate) {
					url = url + "&date=" + this.dateInput;
				} else {
					this.showDateError = true;
				}
			} else {
				this.showDateError = false;
			}
			this.axios
				.get(url, {
					name: this.newBoardName,
				})
				.then((response) => {
					this.boards = response.data;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		addNewBoard() {
			if (this.newBoardName.length == 0) {
				return;
			}

			this.axios
				.post(this.$baseUrl + "api/create-board", {
					name: this.newBoardName,
				})
				.then((response) => {
					let newBoard = {
						id: response.data.id,
						user_id: response.data.user_id,
						name: response.data.name,
						cards: [],
						newCardTitle: "",
					};
					this.boards.push(newBoard);
					this.newBoardName = "";
				})
				.catch((error) => {
					console.log(error);
				});
		},
		removeBoard(index) {
			this.axios
				.post(this.$baseUrl + "api/delete-board", {
					board_id: this.boards[index].id,
				})
				.then(() => {
					this.boards.splice(index, 1);
				})
				.catch((error) => {
					console.log(error);
				});
		},

		addNewCard(boardIndex) {
			if (this.boards[boardIndex].newCardTitle.length == 0) {
				return;
			}

			this.axios
				.post(this.$baseUrl + "api/create-card", {
					board_id: this.boards[boardIndex].id,
					title: this.boards[boardIndex].newCardTitle,
					order: this.boards[boardIndex].cards.length + 1,
				})
				.then((response) => {
					let newCard = response.data;

					this.boards[boardIndex].cards.push(newCard);
					this.boards[boardIndex].newCardTitle = "";
				})
				.catch((error) => {
					console.log(error);
				});
		},

		removeCard(boardIndex, cardIndex) {
			this.axios
				.post(this.$baseUrl + "api/delete-card", {
					card_id: this.boards[boardIndex].cards[cardIndex].id,
				})
				.then(() => {
					this.boards[boardIndex].cards.splice(cardIndex, 1);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		openCardEditModel(boardIndex, cardIndex) {
			this.editingCardIndex = cardIndex;
			this.editingCardBoardIndex = boardIndex;
			this.editCardTitle = this.boards[boardIndex].cards[cardIndex].title;
			this.editCardDescription =
				this.boards[boardIndex].cards[cardIndex].description;
			this.$modal.show("editCardModel");
		},
		onModelClose() {
			this.editingCardIndex = null;
			this.editingCardBoardIndex = null;
			this.editCardTitle = "";
			this.editCardDescription = "";
		},
		saveCard() {
			this.axios
				.post(this.$baseUrl + "api/update-card", {
					board_id: this.boards[this.editingCardBoardIndex].id,
					card_id:
						this.boards[this.editingCardBoardIndex].cards[
							this.editingCardIndex
						].id,
					title: this.editCardTitle,
					description: this.editCardDescription,
				})
				.then((response) => {
					this.boards[this.editingCardBoardIndex].cards[
						this.editingCardIndex
					].title = response.data.title;
					this.boards[this.editingCardBoardIndex].cards[
						this.editingCardIndex
					].description = response.data.description;
				})
				.catch((error) => {
					console.log(error);
				});

			this.$modal.hide("editCardModel");
		},
		log(data, boardIndex) {
			if (data.moved) {
				this.updateCardIndex(data.moved.element);
			}
			if (data.added) {
				this.changeCardBoard(data.added.element, boardIndex);
			}
		},

		changeCardBoard(card, boardIndex) {
			this.axios
				.post(this.$baseUrl + "api/update-card", {
					board_id: this.boards[boardIndex].id,
					card_id: card.id,
					title: card.title,
					description: card.description,
				})
				.then(() => {
					this.updateCardIndex(card);
				})
				.catch((error) => {
					console.log(error);
				});
		},

		updateCardIndex(card) {
			let boardIndex = this.boards.findIndex(
				(item) => item.id == card.board_id
			);
			this.axios
				.post(this.$baseUrl + "api/order-cards", {
					cards: this.boards[boardIndex].cards.map((obj, index) => {
						return { ...obj, order: index };
					}),
				})
				.then(() => {})
				.catch((error) => {
					console.log(error);
				});
		},
		logout() {
			this.$store.dispatch("logout");
			this.$router.push({ name: "Login" });
		},
		dragged(data) {
			console.log(data);
		},
		dumpDB() {
			this.axios({
                    url: this.$baseUrl + "api/create-dump",
                    method: 'GET',
                    responseType: 'blob',
                }).then((response) => {
                     var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                     var fileLink = document.createElement('a');
   
                     fileLink.href = fileURL;
                     fileLink.setAttribute('download', 'dump.sql');
                     document.body.appendChild(fileLink);
   
                     fileLink.click();
                });
		}
	},
};
</script>
<style lang="scss" scoped>
.board {
	.col {
		min-width: 300px;
		max-width: 300px;
		min-height: 500px;
		margin-left: 12px;
		.bemo-card {
			box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px,
				rgba(17, 17, 26, 0.1) 0px 0px 8px;
		}
	}
}
</style>