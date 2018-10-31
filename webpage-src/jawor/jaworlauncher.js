'use strict';

/* this is where the result will be */
var reactants = null;
var products = null;
var ws_adres = "ws://213.135.37.219:57214";
var wynik = '';

//var server_addr = '213.135.37.219';
var server_addr='mapper.grzybowskigroup.pl';

function przywrocGuziki(){
	$("#policz").val("Map reaction!");
	$("#zmapujRysunek")[0].innerHTML = "Map the drawing!";
}

function dajNazweAtomu(smiles, id) {
	var end = smiles.indexOf(":" + id + "]");
	if (end === -1) {
		return null;
	}
	var begin = smiles.lastIndexOf("[", end);
	return smiles.slice(begin + 1, end).replace(/\W/, "");
}

function jestWiazanie(smiles, id) {
	return smiles.search(":" + id + "]") >= 0;
}

function getJawor(jawor_input, callback) {

	// where and how to ask for a mapping
	// var url = 'http://students.mimuw.edu.pl/~wjaworski/cgi-bin/chem.cgi';
	var packData = function (data) {
		var txt = data + '\n';
		return txt;
	};
	var readResponse = function (response) {
		try {
			przywrocGuziki();
			response = jQuery.parseXML(response);
			var reaction = $(response).children('reaction');
			var msg = reaction.children('messages').children('message').map(function() {
		    		return $(this).text();
			}).get().join('\n<br/>');
			var solutions = [];
			var skrot = reaction.children('solutions').children('solution');
			for (var i = 0; i < skrot.length; ++i) {
		    		var rozw = $(skrot[i]);
				var reactants = rozw.children('reactants').first().text();
				var products = rozw.children('products').first().text();
		    		var rozwi = reactants + ">>" + products;
				var reactionToGetName = reactants + ">>" + products;
				var atomy = rozw.children('atoms').children('atom');
				var translator = [];
		    		for (var j = 0; j < atomy.length; ++j) {
		    			var at = $(atomy[j]);
		    			var id = at.attr("id");
		    			var mapId = at.children("label").first().text();
					translator[id] = mapId;
		    			var re = new RegExp(':' + id + ']', 'g');
		    			rozwi = rozwi.replace(re, ":" + mapId + "x" + "]");
		    		}
				rozwi = rozwi.replace(/x/g, "");
				var zmienione_wiazania = rozw.children('bonds').children('bond');
				var info_zmienione = [];
				var zmienione_wodory = [];
				for (var j = 0; j < zmienione_wiazania.length; ++j) {
					var kr = $(zmienione_wiazania[j]);
					var id1 = kr.attr("id1");
					var id2 = kr.attr("id2");
					var addedMsg = "";
					if (translator[id1] === "" &&
					    translator[id2] !== "") {
						var tmp = id1;
						id1 = id2;
						id2 = tmp;
					}
					if (translator[id2] !== "" && translator[id1] !== "") {
						if (translator[id2] < translator[id1]) {
							tmp = id2;
							id2 = id1;
							id1 = tmp;
						}
						addedMsg = "";
						if (kr.text().trim() === "red") {
							if (jestWiazanie(reactants, id2)) {
								addedMsg = "cut bond between ";
							} else {
								addedMsg = "made bond between ";
							}
						} else {
							addedMsg = "changed multiplicity of bond between ";
						}
						var tmpMsg = addedMsg
							    + translator[id1]
							    + "(" + dajNazweAtomu(reactionToGetName, id1) + ")"
							    + " and "
							    + translator[id2]
							    + "(" + dajNazweAtomu(reactionToGetName, id2) + ")"
							    + "\n<br/>";
						info_zmienione.push(tmpMsg);
					}
				}

		    		solutions.push({smiles: rozwi,
						zmiany: Array.from(new Set(info_zmienione)).join("")
					       });
			}
			callback(solutions, msg);

		} catch (err) {
			if (err === 'Unix.Unix_error(Unix.ECONNREFUSED, "connect", "")') {
				callback([], "Server with matching algorithm is down\n" + err);
			} else {
				callback([], "[chem.cgi] processing response fail\n" + err);
			}
		}
	};

    // W RAZIE PROBLEMOW ZAKOMENTOWAC PONIZSZE ZAPYTANIE AJAX
	$.ajax({
		method: 'POST',
		url: "../../chem-server/hello",
		data: {
			'smiles': packData(jawor_input)
		},
		error: function(xhr) {
			console.log('AJAX error ' + xhr.status + " " + xhr.statusText);
		},
		success: function(resp) {
			console.log('AJAX success');
			readResponse(resp);
		},
		complete: function() {
			przywrocGuziki();
		}
	       });


    // W RAZIE PROBLEMOW ODKOMENTOWAC WSZYSTKO CO PONIZEJ
	// var socket = new WebSocket(ws_adres);

	// socket.onmessage = function(s) {
	// 	wynik += s.data;
	// };
	
	// socket.onopen = function() {
	// 	console.log('onopen');
	// 	socket.send(packData(jawor_input));
	// 	wynik = '';
	// };

	// socket.onerror = function(event) {
	// 	console.log('onerror');
	// 	przywrocGuziki();
	// 	alert("Error while communicating with mapping algorithm\nERROR: " + event.data);
	// };
	// socket.onclose = function(event) {
	// 	console.log("onclose");
	// 	readResponse(wynik + "</reaction>");
	// };
	return "JANOSIK";
}


