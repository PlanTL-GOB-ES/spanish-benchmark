function obtainTables(){$.ajax({url:"http://129.151.225.145:3000/api/tables",dataType:"json",success:tableSuccess,error:tableError})}function tableSuccess(e){console.log(e);const a=e.map(e=>[e.email,e.modelName,e.researchGroup,e.paperLink,e.conll_nerc.F1,e.capitel_nerc.F1,e.ud_pos.F1,e.capitel_pos.F1,e.mldoc.F1,e.paws_x.F1,e.sts.Combined,e.sqac.F1,e.xnli.Accuracy]),c=["Rank","Model","Group","Paper","CoNLL-NERC (F1)","CAPITEL-NERC (F1)","UD-POS (F1)","CAPITEL-POS (F1)","MLDoc (F1)","PAWS-X (F1)","STS (Comb.)","SQAC (F1)","XNLI (Acc.)"];let t='<table class="table performanceTable">';t+="<tr>",$(c).each(function(e){t+="<th>"+c[e]}),$(a).each(function(e){t+="<tr>",$(a[e]).each(function(c){switch(c){case 0:t+="<td>"+(e+1);break;case 3:t+='<td><a target="_blank" href='+a[e][c]+'><span class="material-symbols-outlined">open_in_new';break;case 2:t+="<td>"+a[e][c];break;default:t+="<td>"+a[e][c]}})}),$("#leaderboard").html(t)}function tableError(e){console.log(e)}$(document).ready(()=>{obtainTables()});