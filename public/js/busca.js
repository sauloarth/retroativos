


document.getElementById("formulario_busca").addEventListener("submit", function(event){
    event.preventDefault()
  });

const tabela_resultados = document.getElementById("tabela_resultados");
const botao_buscar = document.getElementById("botao_buscar");
const campo_busca = document.getElementById("campo_busca");
const body_tabela_resultados = document.getElementById("body_tabela_resultados");

botao_buscar.addEventListener('click', async () => {
    body_tabela_resultados.innerHTML = '';

    var result = await jQuery.ajax(`/funcionarios?busca=${campo_busca.value}`);

    
    if(result.length === 0) {
        tabela_resultados.style.visibility = 'hidden';
    } else {
        tabela_resultados.style.visibility = 'visible';
    }

    result.forEach((funcionario, index) => {
        
        body_tabela_resultados.innerHTML += 
            `<tr>
                <th scope="row">${index+1}</th>
                <td>${funcionario.nome}</td>
                <td>${funcionario.matricula}</td>
                <td>
                    <span style="font-size: 1.2rem; color: Green;">
                        <i class="fas fa-plus-square"></i>
                    </span>
                    <span style="font-size: 1.2rem; color: Blue;">
                        <a href="/funcionarios/${funcionario._id}/retroativos"><i class="far fa-file-alt"></i><a>
                    </span>
                </td>
            </tr>`
    });
    
})



