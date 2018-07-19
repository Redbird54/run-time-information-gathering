/* global module */
/* global require */

"use strict";

(function(exp) {
	var InteractionSerializer = require("./interactionSerializer.js").InteractionSerializer;

	function RecursiveInteractionsHandler(sMemoryInterface) {
		this.sMemoryInterface = sMemoryInterface;

		this.usedInteractions = {};
		this.mapRecursiveMainInteractions = {};

		this.interactionSerializer = new InteractionSerializer();

		this.getInteractionKey = function(interaction, obj) {
			return this.interactionSerializer.serialize(interaction, obj);
		};

		this.getMainInteractionForCurrentInteraction = function(interaction) {
			var shadowIdInteraction = this.sMemoryInterface.getShadowIdOfObject(interaction);
			if (
				shadowIdInteraction &&
				shadowIdInteraction in this.mapRecursiveMainInteractions) {

				return this.mapRecursiveMainInteractions[shadowIdInteraction];
			}

			return interaction;
		};

		this.associateMainInteractionToCurrentInteraction = function(interaction, result) {
			if (this.interactionAlreadyUsed(interaction, result)) {
				var shadowIdInteraction = this.sMemoryInterface.getShadowIdOfObject(interaction);
				var interactionKey = this.getInteractionKey(interaction, result);
				
				this.mapRecursiveMainInteractions[shadowIdInteraction] = this.usedInteractions[interactionKey];
			}
		};

		this.reportUsedInteraction = function(interaction, result) {
			var interactionKey = this.getInteractionKey(interaction, result);

			this.usedInteractions[interactionKey] = interaction;
		};

		this.interactionAlreadyUsed = function(interaction, result) {
			var interactionKey = this.getInteractionKey(interaction, result);

			return (interactionKey in this.usedInteractions);
		};
	}

	exp.RecursiveInteractionsHandler = RecursiveInteractionsHandler;

})(module.exports);