var GLTF

(function () {
	var button = document.createElement('button')
	button.innerHTML = 'CLICK!!! And choose resources.zip file on your PC.'
	button.style = 'width:400px; font-size:60px; background:#f00; transform:translate(100px, 100px)'
	document.body.append(button)
	const readFile = file => {
		GLTF = []
		var fileType = file.files[0].name.split('.').pop()
		var reader = new FileReader()
		reader.readAsArrayBuffer(file.files[0])
		reader.onload = () => {
			var zip = UZIP.parse(reader.result)
			GLTF = zip
			//alert('File loaded!')
			window.dispatchEvent(new Event('AllFilesLoaded'))
		}
	}
	button.onclick = () => {
		var input = document.createElement('input')
		input.type = 'file'
		input.onchange = () => readFile(input)
		input.click()
		button.style['font-size'] = '30px'
		button.innerHTML = 'Loading resources...'
		window.addEventListener('AllFilesLoaded', () => button.remove())
	}
})()


class XMLHttpRequest {

	open( text, url, aBool ) {
		console.log(url)
		var name = url.split('./').pop()
		this.response = GLTF[name].buffer
		this.status = 200
	}

	addEventListener( text, def ) {
		if ( text === 'load' ) this.onLoad = def
	}

	send() {
		this.onLoad()
	}
}


function fetch(url, options) {
	return new Promise( (resolve, reject) => {
		var name = url.split('./').pop()
		resolve({
			ok: true,
			status: 200,
			blob: function() {
				return new Blob([GLTF[name]], {type: 'image/png'})
			}
		})
	})
}

(function () {
	const el = n => document.querySelector(n)
	var name = [
		'#icon-bar-stats',
		'#icon-bar-inventory',
		'#icon-bar-quests',
		'.inventory-character'
	]
	var src = [
		'./resources/icons/ui/skills.png',
		'./resources/icons/ui/backpack.png',
		'./resources/icons/ui/tied-scroll.png',
		'./resources/icons/ui/inventory-character.png'
	]
	window.addEventListener('AllFilesLoaded', () => {
		src.forEach((s, i) => {
			fetch(s).then(res => res.blob()).then(img => {
				var url = URL.createObjectURL(img)
				el(name[i]).style = 'background-image: url(' + url + ')'
			})
		})
	})
})()