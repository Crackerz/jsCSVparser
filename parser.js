/*
 * Written by William Blankenship
 * 
 * This function accepts a CSV file and attempts to convert
 * it to an array. It will parse any RFC4180 complient csv
 * file.
 * 
 * Copyrighted 2012
 * Licensed under the LGPL v3.0
 * A copy of the LGPL and GPL MUST be distributed
 * with, and accessible from, any application or website
 * using/hosting/distributing this code and/or any derivative
 * of this product.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation version 3 of the License
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function parseCSV(Filename) {
	var text = fetchCSVFile(Filename);
	var data = createCSVArray(text);
	return data;
}//end parseCSV

function fetchCSVFile(Filename) {
	var file = new XMLHttpRequest();
	file.open("GET", Filename,false);
	file.send();
	return file.responseText;
}//end fetchCSVFile

function createCSVArray(S) {
	var fieldDelim = "\n";
	var rawtext = '"';
	var recordDelim = ",";
	var eolReplacement = "<br>";
	var buffer="";
	var field = [];
	var fieldIndex = 0;
	var result = [];
	var resultIndex = 0;
	var rawTextMode = false;
	
	for(var i=0,l=S.length;i<l;i++) {
		if(S.charAt(i) == fieldDelim) {
			if(!rawTextMode) {
				if(buffer.length>0) {
					field[fieldIndex++] = buffer;
				}//end-if
				if(field.length>0) {
					result[resultIndex++] = field;
				}
				buffer = "";
				field = [];
				fieldIndex = 0;
			} else {
				buffer += eolReplacement;
			} //end else
		} else if(S.charAt(i) == rawtext) {
			if(!rawTextMode) {
				rawTextMode = true;
			} else {
				if(i<l-1&&S.charAt(i+1)==rawtext) {
					buffer+=S.charAt(i);
				} else {
					rawTextMode = false;
				} //end else
			} //end else
		} else if(S.charAt(i) == recordDelim) {
			if(!rawTextMode) {
				field[fieldIndex++] = buffer;
				buffer = "";
			} else {
				buffer += S.charAt(i);
			} //end else
		} else {
			buffer += S.charAt(i);
		} //end else
	}//end for-loop
	if(buffer.length>0)
		field[fieldIndex++] = buffer;
	buffer = "";
	if(field.length>0)
		result[resultIndex++] = field;
	return result;
}//end createCSVArray