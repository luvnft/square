<script src="https://cdn.tailwindcss.com"></script>;

let previousWindow = null;

const userId = "6629c9f7ab7170b2f9fd979f";

const decodeRoomId = (roomId) => {
  let decodedString = "";
  for (let i = 0; i < roomId.length; i += 2) {
    decodedString += String.fromCharCode(parseInt(roomId.substr(i, 2), 16));
  }
  return decodedString;
};

const createLiveBadge = () => {
  const badge = document.createElement("button");
  badge.textContent = "LIVE";
  badge.className =
    "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-red-400";
  return badge;
};

const createRecordingBadge = () => {
  const badge = document.createElement("button");
  badge.textContent = "DEMO";
  badge.className =
    "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-blue-400";
  return badge;
};

const openLiveStream = (productId) => {
  if (previousWindow && !previousWindow.closed) {
    previousWindow.close();
  }
  const newWindowFeatures = "width=500,height=1000,left=100,top=100";
  previousWindow = window.open(
    "http://localhost:3000/video/" + productId,
    "_blank",
    newWindowFeatures
  );
};

const addLiveBadgeToParagraph = (p, productId) => {
  const badge = createLiveBadge();
  badge.addEventListener("click", (e) => {
    e.preventDefault();
    openLiveStream(productId);
  });
  p.insertAdjacentElement("afterend", badge);
};

const addRecordingBadgeToParagraph = (p, productId) => {
  const badge = createRecordingBadge();
  badge.addEventListener("click", (e) => {
    e.preventDefault();
    openLiveStream(productId);
  });
  p.insertAdjacentElement("afterend", badge);
};

const fetchRecordings = async () => {
  const response = await fetch(
    "http://localhost:3000/api/recordings/list_recordings/" + userId
  );
  const recordings = await response.json();
  return recordings;
};

setTimeout(async () => {
  const response = await fetch(
    "http://localhost:3000/api/rooms/list_rooms/" + userId
  );
  const items = await response.json();
  const recordings = await fetchRecordings();
  document.querySelectorAll("p").forEach((p) => {
    const itemText = p.textContent.trim();
    const matchingItem = items.find((item) =>
      itemText.includes(decodeRoomId(item?.roomId))
    );
    const matchingRecording = recordings.find((recording) =>
      itemText.includes(decodeRoomId(recording?.roomId))
    );
    if (matchingItem) {
      const productId = matchingItem?.roomId;
      addLiveBadgeToParagraph(p, productId);
    }
    if (matchingRecording) {
      const productId = matchingRecording?.roomId;
      addRecordingBadgeToParagraph(p, productId);
    }
  });
  const modal = createModal("hello", "hello", "black");
  document.body.appendChild(modal);
}, 2000);


function createModal(modalTitle, modalMessage, modalColor) {
  const modalContent = document.createElement("div");
  modalContent.className =
    "fixed top-0 left-0 w-full h-full flex items-center justify-center z-50";
  modalContent.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

  const modalDialog = document.createElement("div");
  modalDialog.className =
    "relative rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8 animate__animated animate__fadeInDown";
  modalDialog.style.backgroundColor = "white";
  modalDialog.style.minWidth = "300px"; 
  modalContent.appendChild(modalDialog);

    const closeButton = document.createElement("button");
    closeButton.className =
      "absolute top-0 right-0 mt-1 mr-1 px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none";
    closeButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.879 14.879a1 1 0 01-1.414 0L10 11.414l-3.464 3.465a1 1 0 01-1.414-1.414L8.586 10 5.122 6.536a1 1 0 111.414-1.414L10 8.586l3.465-3.464a1 1 0 111.414 1.414L11.414 10l3.465 3.465a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>';
    closeButton.addEventListener("click", () => {
      modalContent.remove();
    });
  modalDialog.appendChild(closeButton);
  
  const flexContainer = document.createElement("div");
  flexContainer.className = "flex items-center gap-4";
  modalDialog.appendChild(flexContainer);

  const iconSpan = document.createElement("span");
  iconSpan.style.backgroundColor = modalColor;
  iconSpan.className = "shrink-0 rounded-full p-2 text-white";
  flexContainer.appendChild(iconSpan);

  const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  iconSvg.setAttribute("class", "h-4 w-4");
  iconSvg.setAttribute("fill", "currentColor");
  iconSvg.setAttribute("viewBox", "0 0 20 20");
  iconSpan.appendChild(iconSvg);

  const iconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  iconPath.setAttribute("clip-rule", "evenodd");
  iconPath.setAttribute("fill-rule", "evenodd");
  iconPath.setAttribute(
    "d",
    "M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
  );
  iconSvg.appendChild(iconPath);

  const titleParagraph = document.createElement("p");
  titleParagraph.className = "font-medium sm:text-lg text-black";
  titleParagraph.textContent = modalTitle;
  flexContainer.appendChild(titleParagraph);

  const messageParagraph = document.createElement("p");
  messageParagraph.className = "mt-4 text-gray-500";
  messageParagraph.textContent = modalMessage;
  modalDialog.appendChild(messageParagraph);

  const buttonDiv = document.createElement("div");
  buttonDiv.className = "mt-6 sm:flex sm:gap-4";
  modalDialog.appendChild(buttonDiv);

  const actionButton = document.createElement("a");
  actionButton.style.backgroundColor = modalColor;
  actionButton.className =
    "inline-block w-full rounded-lg px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto";
  actionButton.href = "#";
  actionButton.textContent = "Take a Look";
  buttonDiv.appendChild(actionButton);

  return modalContent;
};