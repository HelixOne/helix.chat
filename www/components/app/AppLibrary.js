if (!window.location.origin) {
  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

function genName(){
	return ("0000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6)
}