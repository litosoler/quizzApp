//state objects
var preguntas= [{},
				{pregunta: "&#191cuanto es 5x5?", rpts:["25", "20", "15", "10"], correcta: "25", intento: false, rptUsuario: "",}, 
				{pregunta: "&#191Cual es la capital de Honduras?", rpts: ["Tegucigalpa", "Comayagua", "Siguatepeque", "Olancho"], correcta: "Tegucigalpa", intento: false, rptUsuario: ""},
				{pregunta: "&#191cuanto es 2+2?", rpts:["29", "4", "8", " 5"], correcta: "4", intento: false, rptUsuario: "", },
				{pregunta: "&#191cuanto es 2+0?", rpts:["2", "100", "8", " 5"], correcta: "2" , intento: false, rptUsuario:"", },
				{pregunta: "&#191cuanto es 2+6?", rpts:["40", "4", "8", " 5"], correcta: "8" , intento: false, rptUsuario: "",},
				{pregunta: "&#191cuanto es 2+2?", rpts:["70", "4", "8", " 5"], correcta: "4" , intento: false, rptUsuario: "", },
				{pregunta: "&#191cuanto es 2+0?", rpts:["2", "15", "8", " 5"], correcta: "2" , intento: false, rptUsuario: "",},
				{pregunta: "&#191cuanto es 2+6?", rpts:["0", "4", "8", " 5"], correcta: "8", intento: false, rptUsuario:"", },
				];
var state = {totalOk: 0, totalFail: 0, restantes: preguntas.length - 1};


//state functions
function  contabilisarRespuesta(state ,descripcion, respuesta){
		
	if(!descripcion.intento){
		if (descripcion.rpts[respuesta] == descripcion.correcta) {
			state.totalOk = state.totalOk +1;
			state.restantes = state.restantes -1;
			return true;
		}else{
			state.totalFail = state.totalFail + 1;
			state.restantes = state.restantes -1;
			return false;
		}
	}


}

function marcarIntento(descripcion){
	descripcion.intento = true;
}

function guardarRespuesta(descripcion, indexRpt){
	descripcion.rptUsuario = indexRpt;
}

//render funcions
function renderResumen(preguntas, element){
	arrayPartes = preguntas.map(function(item, index){
		if (index > 0) {
		return '<a class="opcion" id="'+ index +'" href="#" >'+ index +'</a>';
		}
	});
	element.html(arrayPartes);
}

function renderDescripcion(preguntas, index){
	var descripcion = preguntas[index];
	renderPregunta(descripcion, $('.pregunta'), index);
	renderRespuestas(descripcion, $('#respuestas'));
}
function renderPregunta(descripcion, element, index){
	element.html(descripcion.pregunta);
	element.attr('id', index);
}

function renderRespuestas(descripcion, element){
	arrayRpts = descripcion.rpts.map(function(item, index){
		return '<label class="container respuesta" >'+ item+
				  '<input type="radio"  name="radio" value="'+ index +'" >'+
				  '<span class="checkmark"></span>'+
				'</label>';

	});
	element.html(arrayRpts);
}



//handdle funcions
//al iniciar la pagina
$(function(){
	renderResumen(preguntas, $('#enumeracion'));
	$('main').attr("hidden", true);
	inicar();
	desactivaEval();
});
//maneja el click a el boton iniciar
function inicar(){
//	$('#iniciar').click(function(){
		$('main').attr("hidden", false);
		renderDescripcion(preguntas, 1);
		$("a[id = '1']").addClass('seleccionada');
//	});
}

//maneja los click el indice de las preguntas
$("#resumen").on("click", "a", function(event){
	var index = parseInt($(this).html());
	renderDescripcion(preguntas, index);
	desactivaEval();
	$("a").removeClass('seleccionada');
	$("a[id = '"+ index +"']").addClass('seleccionada');
	if (preguntas[index].intento){
		desacRadioButones();
		$("input[value = " + preguntas[index].rptUsuario + "]").attr('checked', true);
		$("a[id = '"+index+"']").removeClass('seleccionada');

	}
});
//muestra la solucion a la pregunta, se llama desde la funcion que maneja el click a el boton evaluar
function mostrarSolucion(descripcion){
	$("#solucion p").html("La respuesta correcta es: " + descripcion.correcta);
}
//marca el indice de las  preguntas, se llama desde la funcion que maneja el click a el boton evaluar
function marcarResumen(indice, estado){

	var selector = '#resumen a[id = '+ indice +']';
	if (estado) {
		$(selector).addClass("bien");
	}else{
		$(selector).addClass("mal");
	}
}

//verifica las respuestas, se dispara cuando das click al boton evaluar
$("#evaluar").click(function(){
	var preguntaIndice = parseInt($(".pregunta").attr("id"));
	var descripcion = preguntas[preguntaIndice];
	var respuesta = $(":checked").closest("input").attr("value");
	var estado = contabilisarRespuesta(state, descripcion,respuesta);
	mostrarSolucion(descripcion);
	marcarResumen(preguntaIndice, estado);
	marcarIntento(descripcion);
	desactivaEval();
	desacRadioButones();
	guardarRespuesta(descripcion, respuesta);
});

function desacRadioButones(){
	$("input[type= 'radio']").attr('disabled', 'true');
}

$("#respuestas").on("click", "input", function(event){
	actEval();
});

//desactiva el boton de evaluar
function desactivaEval(){
	$('#evaluar').attr("disabled", "true");
}

//activa el boton de evaluar
function actEval(){
	$('#evaluar').removeAttr("disabled");
}
