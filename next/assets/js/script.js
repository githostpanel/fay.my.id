/* ---------------- Tools Page ---------------- */
if (document.getElementById("toolList")) {
  const toolList = document.getElementById("toolList");
  const toolSearch = document.getElementById("toolSearch");

  function renderTools(q="") {
    toolList.innerHTML = "";
    tools.filter(t => t.name.toLowerCase().includes(q.toLowerCase()))
      .forEach(t => {
        const card = document.createElement("div");
        card.className = "tool-card";
        card.innerHTML = `<h3>${t.name}</h3><p>${t.desc}</p>`;
        toolList.appendChild(card);
      });
  }
  renderTools();
  toolSearch.addEventListener("input", e => renderTools(e.target.value));
}

/* ---------------- Gallery Page ---------------- */
if (document.getElementById("grid")) {
  const grid = document.getElementById("grid");
  const btnLoad = document.getElementById("btnLoadMore");
  const qInput = document.getElementById("q");
  const chipsWrap = document.getElementById("chips");

  const overlay = document.getElementById("overlay");
  const viewerImg = document.getElementById("viewerImg");
  const viewerCaption = document.getElementById("viewerCaption");
  const btnClose = document.getElementById("btnClose");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const idxIndicator = document.getElementById("idxIndicator");

  const BATCH = 5;
  let filteredIndices = imagesData.map((_,i)=>i);
  let renderPointer = 0;
  let currentModalPos = 0;

  function createCard(idx) {
    const d = imagesData[idx];
    const fig = document.createElement("article");
    fig.className = "card";
    fig.dataset.idx = idx;
    fig.innerHTML = `<img class="thumb" src="${d.thumb}" alt="${d.caption}">
    <div class="meta"><strong>${d.title}</strong><br>${d.caption}</div>`;
    return fig;
  }

  function loadNextBatch() {
    if (renderPointer >= filteredIndices.length) return;
    btnLoad.classList.add("loading");
    setTimeout(() => {
      const end = Math.min(renderPointer+BATCH, filteredIndices.length);
      for (let i=renderPointer;i<end;i++){
        const card = createCard(filteredIndices[i]);
        grid.appendChild(card);
        requestAnimationFrame(() => {
          setTimeout(() => card.classList.add("visible"), 40);
        });
      }
      renderPointer = end;
      btnLoad.classList.remove("loading");
      if (renderPointer >= filteredIndices.length) btnLoad.style.display="none";
    }, 600);
  }

  function applyFilter() {
    const q = (qInput.value||"").toLowerCase();
    filteredIndices = imagesData.map((_,i)=>i).filter(i=>{
      const d = imagesData[i];
      return d.title.toLowerCase().includes(q) || d.caption.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
    });
    grid.innerHTML="";
    renderPointer=0;
    btnLoad.style.display="inline-flex";
    loadNextBatch();
  }

  qInput.addEventListener("input", applyFilter);

  btnLoad.addEventListener("click", loadNextBatch);

  /* modal */
  grid.addEventListener("click", e=>{
    const card = e.target.closest(".card");
    if (!card) return;
    currentModalPos = filteredIndices.indexOf(Number(card.dataset.idx));
    showViewer();
  });

  function showViewer(){
    const d = imagesData[filteredIndices[currentModalPos]];
    overlay.classList.add("open");
    viewerImg.src=d.full;
    viewerCaption.textContent=d.caption;
    idxIndicator.textContent=`${currentModalPos+1}/${filteredIndices.length}`;
  }
  btnClose.onclick=()=>overlay.classList.remove("open");
  btnPrev.onclick=()=>{ if(currentModalPos>0){ currentModalPos--; showViewer(); } };
  btnNext.onclick=()=>{ if(currentModalPos<filteredIndices.length-1){ currentModalPos++; showViewer(); } };

  applyFilter();
}
