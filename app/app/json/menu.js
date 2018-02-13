import text from '../util/text'
import kts from '../util/kts'

module.exports = [
  {
    go: kts.waitingServices.id,
    title: text.menu.label.waitingServices,
    icon: {
      url: require(`../../img/services.png`),
      width: 20.5,
      height: 26.5
    }
  },
  {
    go: kts.changePassword.id,
    title: text.menu.label.changePassword,
    icon: {
      url: require(`../../img/password.png`),
      width: 20.5,
      height: 26.5
    }
  },
  {
    go: kts.rechargePoints.id,
    title: text.menu.label.rechargePoints,
    icon: {
      url: require(`../../img/recharge_points.png`),
      width: 20,
      height: 25.5
    }
  },
  {
    go: kts.shoppingHistory.id,
    title: text.menu.label.shoppingHistory,
    icon: {
      url: require(`../../img/card_recharge.png`),
      width: 20.5,
      height: 15.42
    }
  }
]
