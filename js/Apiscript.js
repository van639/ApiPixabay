"use strict";
let contador = document.querySelector("#pagina");

const limparElementos = elemento =>{
    while(elemento.firstChild){
        elemento.removeChild(elemento.lastChild);
    }
}

const carregarStatus = (status,pesquisa,tipoBusca) =>{
    const container = document.querySelector(".status");
    const newStatus = document.createElement("p");
    newStatus.classList = ".txt-padrao";
    newStatus.innerHTML = `${status.totalHits} ${tipoBusca} grátis de ${pesquisa}`;
    container.appendChild(newStatus);
}


const tipoBusca = ()=>{
    const busca = document.querySelector("#categorias").value;
    let tipoBusca = busca.substring(0,busca.lastIndexOf('.'));
    const categorias = busca.substring(busca.lastIndexOf('.') + 1);    
        
    if(tipoBusca == "imagens"){
        var urlBusca = `image_type=${categorias}`;
        var pastaVideo = "";
    }
    else{
        var urlBusca = `video_type=${categorias}`;
        var pastaVideo = "videos/";
    }
    const arrayBusca = [urlBusca,pastaVideo,tipoBusca];
    return arrayBusca;
}
 
const pesquisarImagens = async(pesquisa) =>{
        const ordernar = document.querySelector("#order").value;
        const orientacao = document.querySelector("#orientation").value;
        const categoria = document.querySelector("#category").value;
        const cor = document.querySelector("#color").value;
    
        let pagina = contador.value;

        const busca = tipoBusca();
        const url = `https://pixabay.com/api/${busca[1]}?key=24111070-9d458bc0fb73a56427cd59113&q=${pesquisa}&lang=pt&${busca[0]}&per_page=20&page=${pagina}&order=${ordernar}&orientation=${orientacao}&category=${categoria}&colors=${cor}`;
        const response = await fetch(url);
        const imagens = await response.json();

        limparElementos(document.querySelector("#container-galeria"));
        limparElementos(document.querySelector(".status"));
        

        carregarGaleria(imagens.hits);
        carregarStatus(imagens,pesquisa,busca[2]);


}

const pesquisa =(evento)=>{
    if(evento.key == "Enter"){
        contador.value = 1;
        const pesquisa = evento.target.value;
        pesquisarImagens(pesquisa);
        
    }
}

const verificarUser = (item) =>{
    if(item.userImageURL == ''){
        item.userImageURL = 'img/user.png'
        return item.userImageURL
    }
    else{
        return item.userImageURL;
    }
    
}

const criarItem = item =>{
    const container = document.querySelector("#container-galeria");
    const newCard =document.createElement("div");
    const tags = item.tags.replace(/,+/g, '');
    item.userImageURL = verificarUser(item);

    newCard.innerHTML = `
                <a class="img-perfil" href="https://pixabay.com/users/${item.user}-${item.user_id}/">
                    <img class="img-perfil" src="${item.userImageURL}">
                </a>
                <div class="options">
                    <div class="info">${tags}</div>
                    <div class="row">
                        <div class="row info"><img src="img/like-24.png">${item.likes}</div>
                        <div class="row info"><img src="img/comment-24.png">${item.comments}</div>
                        <div class="row info"><img src="img/star-24.png"></div>
                    </div>
                </div>
                <a class="card-image"href="${item.pageURL}">
                <img class="card-image" src="${item.webformatURL?item.webformatURL:'https://i.vimeocdn.com/video/'+ item.picture_id+'_640x360.jpg'} ">
                </a>
            `;

    container.appendChild(newCard);
}
const carregarGaleria = imagens => imagens.forEach(criarItem);

document.querySelector("#pesquisa").addEventListener("keypress", pesquisa);
