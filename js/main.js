
    let newVariantButton = document.getElementById("add_variant_btn");
    let voteEditSubmitButton = document.getElementById("new_vote_submit");
    let variantsList = document.getElementById("voting_variants_list");
    let votingTypeSelect = document.getElementById("new_vote_type")

    let votingType = votingTypeSelect.value;

    newVariantButton.addEventListener("click", addNewVoteField);
    voteEditSubmitButton.addEventListener("click", submitVotingEdit);
    votingTypeSelect.addEventListener("change", typeSelectChanged);

    voteVariantsNumber = 0;

    initList();

    function typeSelectChanged(e) {
        votingType = e.target.value;

        variantsList.innerHTML = "";

        initList();
    }

    function initList() {
        voteVariantsNumber = 0;
        if (votingType == "discrete") {
            newVariantButton.classList.add("new_variant_btn_collapsed");
        }
        else {
            newVariantButton.classList.remove("new_variant_btn_collapsed");
        }

        for (let i = 0; i < 2; i++) {
            let voteVariant = document.createElement('div');
            voteVariant.classList.add("card");
            voteVariant.classList.add("h-100");
            voteVariant.classList.add("border-primary");
            voteVariant.style = "margin: 5px;";

            let voteVariantContainer = document.createElement('div');
            voteVariantContainer.classList.add("container");

            let defVoteVariant = document.createElement('div');
            defVoteVariant.classList.add("row");
            defVoteVariant.classList.add("align-items-center");

            let variantDescriptionContainer = document.createElement("div");
            variantDescriptionContainer.classList.add("col-lg-10");
            variantDescriptionContainer.classList.add("form-floating");
            variantDescriptionContainer.classList.add("mb-3");
            variantDescriptionContainer.style = "margin: 10px;";

            let variantDescriptionInput = document.createElement('textarea');
            variantDescriptionInput.classList.add("form-control");
            variantDescriptionInput.id = "new_vote_variant_" + i;
            variantDescriptionInput.placeholder = "Описание варианта голосования...";

            let variantDescriptionLabel = document.createElement('label');
            variantDescriptionLabel.htmlFor = "new_vote_variant_" + i;
            variantDescriptionLabel.innerHTML = "Описание варианта голосования";

            variantDescriptionContainer.appendChild(variantDescriptionInput);
            variantDescriptionContainer.appendChild(variantDescriptionLabel);

            defVoteVariant.appendChild(variantDescriptionContainer);

            voteVariantContainer.appendChild(defVoteVariant);

            voteVariant.appendChild(voteVariantContainer)

            variantsList.appendChild(voteVariant);

            voteVariantsNumber++;
        }
    }

    function addNewVoteField() {
        if (votingType == "discrete") {
            return;
        }

        let voteVariant = document.createElement('div');
        voteVariant.classList.add("card");
        voteVariant.classList.add("h-100");
        voteVariant.classList.add("border-primary");
        voteVariant.style = "margin: 5px;";

        let voteVariantContainer = document.createElement('div');
        voteVariantContainer.classList.add("container");

        let defVoteVariant = document.createElement('div');
        defVoteVariant.classList.add("row");
        defVoteVariant.classList.add("align-items-center");

        let variantDescriptionContainer = document.createElement("div");
        variantDescriptionContainer.classList.add("col-lg-10");
        variantDescriptionContainer.classList.add("form-floating");
        variantDescriptionContainer.classList.add("mb-3");
        variantDescriptionContainer.style = "margin: 10px;";

        let variantDescriptionInput = document.createElement('textarea');
        variantDescriptionInput.classList.add("form-control");
        variantDescriptionInput.id = "new_vote_variant_" + voteVariantsNumber;
        variantDescriptionInput.placeholder = "Описание варианта голосования...";

        let variantDescriptionLabel = document.createElement('label');
        variantDescriptionLabel.htmlFor = "new_vote_variant_" + voteVariantsNumber;
        variantDescriptionLabel.innerHTML = "Описание варианта голосования";

        let removeBtnContainer = document.createElement("div");
        removeBtnContainer.classList.add("col-lg-1");
        removeBtnContainer.classList.add("align-items-center");

        let removeVoteVariantBtn = document.createElement('button');
        removeVoteVariantBtn.type = "button";
        removeVoteVariantBtn.classList.add("btn-close");
        removeVoteVariantBtn.ariaLabel = "Remove";

        removeBtnContainer.appendChild(removeVoteVariantBtn);
        removeVoteVariantBtn.addEventListener("click", removeVoteField);

        variantDescriptionContainer.appendChild(variantDescriptionInput);
        variantDescriptionContainer.appendChild(variantDescriptionLabel);

        defVoteVariant.appendChild(variantDescriptionContainer);
        defVoteVariant.appendChild(removeVoteVariantBtn);

        voteVariantContainer.appendChild(defVoteVariant);

        voteVariant.appendChild(voteVariantContainer)

        variantsList.appendChild(voteVariant);

        voteVariantsNumber++;
    }

    function removeVoteField(e) {
        let elem = e.target.parentNode;
        while (true) {
            if (elem.classList.contains("card")) break;

            elem = elem.parentNode;
        }

        elem.parentNode.removeChild(elem);
        voteVariantsNumber--;
    }

    function submitVotingEdit() {
        let votingTitleInput = document.getElementById("new_voting_title");
        let votingDescriptionInput = document.getElementById("new_voting_description");

        if (votingTitleInput.value == "") {
            votingTitleInput.classList.add("alert-danger");
            return;
        }
        votingTitleInput.classList.remove("alert-danger");

        if (votingDescriptionInput.value == "") {
            votingDescriptionInput.classList.add("alert-danger");
            return;
        }
        votingDescriptionInput.classList.remove("alert-danger");

        let array = []

        for (let i = 0; i < variantsList.children.length; i++) {
            let newVariantInput = document.getElementById("new_vote_variant_" + i);

            if (newVariantInput.value == "") {
                newVariantInput.classList.add("alert-danger");
                array = [];
                return;
            }
            newVariantInput.classList.remove("alert-danger");

            array.push(newVariantInput.value);
        }

        let xhr = new XMLHttpRequest();
        xhr.open("post", "/vote/add/", true);

        xhr.setRequestHeader("x-csrf-token", getPageCSRFToken());
        xhr.setRequestHeader("X-CSRFToken", getPageCSRFToken());

        let votingCreationData = {
            title: votingTitleInput.value,
            description: votingDescriptionInput.value,
            type: votingType,
            vote_variants: array
        };

        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let creationResponseData = JSON.parse(xhr.response);

                    if (creationResponseData.status == "ok") {
                        setTimeout(() => { window.location.replace("../" + creationResponseData.params.voting_id); }, 3000);
                        showModal(1, "Голосование создано!\n Вы будете перенаправлены на него через 3 секунды...");
                    }
                    else {
                        showModal(0, creationResponseData.description);
                    }
                }
                else {
                    showModal(0, "Server error! Report and try again later.");
                }
            }
        });

        xhr.send(JSON.stringify(votingCreationData));
    }

    function getPageCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

    function showModal(type, description) {
        let modalHeaderIcon = document.getElementById("modalHeaderIcon");
        let modalHeaderLabel = document.getElementById("modalHeaderLabel");
        let modalBodyLabel = document.getElementById("modalBodyLabel");

        if (type == 0) {
            modalHeaderIcon.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#error");
            modalHeaderLabel.innerHTML = "Error!";
        }
        else {
            modalHeaderIcon.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#success");
            modalHeaderLabel.innerHTML = "Success!";
        }

        modalBodyLabel.innerHTML = description;

        $("#votingCreationModal").modal("show");
    }
