import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg g > g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg g > g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    amex: ["#64593E", "#000000"],
    diners: ["#FFFFFF", "#009FF8"],
    discover: ["#6C2121", "#000000"],
    jcb: ["#F43D31", "#78D56F"],
    maestro: ["#3A9BD9", "#CC2131"],
    elo: ["#DDBC67", "#68E4FF"],
    hipercard: ["#FFFFFF", "#822124"],
    default: ["black", "gray"]
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

const SecurityCode = document.querySelector("#security-code")
const SecurityCodePattern = {
  mask: "000"
}
const SecurityCodeMasked = IMask(SecurityCode, SecurityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },

    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^((401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636369|(506699|5067[0-6]\d|50677[0-8])|(50900\d|5090[1-9]\d|509[1-9]\d{2})|65003[1-3]|(65003[5-9]|65004\d|65005[0-1])|(65040[5-9]|6504[1-3]\d)|(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|(65054[1-9]|6505[5-8]\d|65059[0-8])|(65070\d|65071[0-8])|65072[0-7]|(65090[1-9]|65091\d|650920)|(65165[2-9]|6516[6-7]\d)|(65500\d|65501\d)|(65502[1-9]|6550[3-4]\d|65505[0-8]))[0-9]{10,12})/,
      cardType: "elo"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/,
      cardType: "hipercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
      cardType: "discover"
    },
    {
      mask: "0000 000000 00000",
      regex: /^3[47]\d{0,13}/,
      cardType: "amex"
    },
    {
      mask: "0000 000000 0000",
      regex: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
      cardType: "diners"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:35\d{0,2})\d{0,12}/,
      cardType: "jcb"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
      cardType: "maestro"
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default"
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    //Mask para substituir todo NÃO DIGITO por "VAZIO".
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const findMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(findMask)

    return findMask
  }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButtonInfo = document.querySelector("#addCard")
addButtonInfo.addEventListener("click", () => {
  alert("Você adicionou um novo cartão!")
})

document.querySelector("form").addEventListener("submit", event => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "SEU NOME AQUI" : cardHolder.value
})

SecurityCodeMasked.on("accept", () => {
  updateSecurityCode(SecurityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "000" : code
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccDate = document.querySelector(".cc-expiration .value")
  ccDate.innerText = date.length === 0 ? "12/30" : date
}

cardNumberMasked.on("accept", () => {
  const type = cardNumberMasked.masked.currentMask.cardType
  setCardType(type)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "0000 0000 0000 0000" : number
}
