function obtainTables(){$.ajax({url:"https://bscplantl01.bsc.es/evales/api/tables",dataType:"json",success:tableSuccess,error:tableError})}function tableSuccess(t){console.log("d:",t);const e=t.map(t=>[t.modelName,t.researchGroup,t.url,Number(Number(t.sum)/Number(8)).toPrecision(4).toString(),Number(t["CoNLL-NERC"].F1).toPrecision(4).toString(),Number(t["UD-POS"].F1).toPrecision(4).toString(),Number(t.MLDoc.F1).toPrecision(4).toString(),Number(t["PAWS-X"].F1).toPrecision(4).toString(),Number(t.STS.combined_score).toPrecision(4).toString(),Number(t.SQAC.f1).toPrecision(4).toString(),Number(t.XNLI.Accuracy).toPrecision(4).toString(),Number(t.Massive.Accuracy).toPrecision(4).toString()]),a=["Rank","Model","Submitted by","URL","Score","CoNLL-NERC (F1)","UD-POS (F1)","MLDoc (F1)","PAWS-X (F1)","STS (Comb.)","SQAC (F1)","XNLI (Acc.)","Massive (Acc.)"],r=["","","","","","nerc","pos","mldoc","pawsx","sts","qa","xnli","massive"];let o='<table id="table" class="performanceTable table">';o+="<thead><tr>",$(a).each(function(t){""!=r[t]?o+='<th><a href="datasets.html#'+r[t].toLowerCase()+'">'+a[t]+"</a></th>":o+="Paper"===a[t]?'<th style="width:30px;">'+a[t]+"</th>":"<th>"+a[t]+"</th>"}),o+="</tr></thead><tbody>",$(e).each(function(t){o+="<tr>",o+="<td>"+(t+1)+"</td>",$(e[t]).each(function(a){switch(a){case 2:""!=e[t][a]?o+='<td><a target="_blank" href='+e[t][a]+'><span class="material-symbols-outlined">open_in_new</span></a></td>':o+="<td></td>";break;default:o+="<td>"+e[t][a]+"</td>"}}),o+="</tr>"}),o+="</tbody></table>",$("#leaderboard").html(o),$("#table").DataTable({paging:!1,autoWidth:!1,order:[[0,"asc"]],columnDefs:[{targets:[1,2,3],orderable:!1},{targets:"_all",className:"dt-center"},{targets:"_all",orderSequence:["desc","asc"]}],searching:!1})}function tableError(t){console.log(t)}$(document).ready(()=>{obtainTables()});