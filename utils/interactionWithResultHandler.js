/* global J$ */

'use strict';

(function (sandbox) {
  function InteractionWithResultHandler(interactionContainerFinder, recursiveInteractionsHandler) {
    this.interactionContainerFinder = interactionContainerFinder;
    this.recursiveInteractionsHandler = recursiveInteractionsHandler;

    var dis = this;

    this.processInteractionWithResult = function (interaction, functionId, result, base) {
      dis.interactionContainerFinder.addMapping(interaction, result);
      dis.recursiveInteractionsHandler.associateMainInteractionToCurrentInteraction(
        interaction,
        result,
      );

      addInteractionToContainer(interaction, base, result);
    };

    function addInteractionToContainer(interaction, base, result) {
      let containerForAddingNewInteraction = dis.interactionContainerFinder.findInteraction(base);

      if (
        containerForAddingNewInteraction &&
        !dis.recursiveInteractionsHandler.interactionAlreadyUsed(interaction, result)
      ) {
        containerForAddingNewInteraction = dis.recursiveInteractionsHandler.getMainInteractionForCurrentInteraction(
          containerForAddingNewInteraction,
        );
        containerForAddingNewInteraction.addInteraction(interaction);
        dis.recursiveInteractionsHandler.reportUsedInteraction(interaction, result);
      }
    }
  }

  if (sandbox.utils === undefined) {
    sandbox.utils = {};
  }

  sandbox.utils.interactionWithResultHandler = new InteractionWithResultHandler(
    sandbox.utils.interactionContainerFinder,
    sandbox.utils.recursiveInteractionsHandler,
  );
})(J$);
