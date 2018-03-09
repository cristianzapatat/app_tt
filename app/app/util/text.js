/** Archivo que contiene los textos del aplicativo. **/
module.exports = {
  intenet: {
    without: 'Sin conexión a internet'
  },
  login: {
    label: {
      idCard: 'Cédula',
      password: 'Contraseña',
      enter: 'Entrar'
    },
    msn: {
      empty: 'Debe diligenciar sus credenciales.',
      verifyInternet: 'Verifique su coneción de Internet.',
      verifyCredential: 'Aceso denegado, verifique sus credenciales',
      userInactive: 'Usuario inactivo, comuniquese a soporte',
      error: 'Se presento un error, intenta de nuevo',
      sessionEnd: 'La sesión a finalizado',
      errorTaxi: 'Su taxi esta ocupado o no se ha resgistrado'
    }
  },
  app: {
    get: {
      position: 'Obteniendo posición'
    },
    icon: {
      you: 'Tú',
      client: 'Cliente'
    },
    label: {
      available: 'Servicios\ndisponibles',
      borroweb: 'Servicios hoy\nprestados',
      cancel: 'Cancelar',
      accept: 'Aceptar',
      a: 'A',
      second: 'seg',
      iArrived: 'Llegué!',
      aboard: 'Pasajero abordo',
      weArrived: 'Llegamos!',
      coming: 'Viene en camino',
      otherAccept: 'El servicio ya\nha sido aceptado',
      notAddress: 'Dirección no definida',
      sessionEnding: 'Cerrando sesión',
      sessionStarting: 'Iniciando sesión'
    },
    gps: {
      update: 'Actualizar',
      offGps: 'Favor enceder GPS',
      withoutPermission: 'Sin permisos de GPS'
    }
  },
  waitingServices: {
    label: {
      title: 'Servicios en espera',
      return: 'Volver',
      position: 'Obteniendo posición\nEspere unos segundos'
    },
    gps: {
      withoutPermission: 'Sin permisos de GPS'
    }
  },
  item: {
    label: {
      accept: 'Aceptar',
      package: 'Sin nombre',
      symbolPrice: '$',
      symbolMore: '+',
      services: 'servicios',
      commission: 'comisión'
    }
  },
  changePassword: {
    label: {
      title: 'Modificando contraseña',
      current: 'Contraseña actual',
      new: 'Contraseña nueva',
      repeat: 'Repetir contraseña',
      save: 'Guardar'
    },
    msn: {
      changeSuccess: 'Contraseña modificada exitosamente.',
      empty: 'Debe diligenciar todos los campos.',
      noEquals: 'Las nuevas contraseñas no coinciden.',
      verifyInternet: 'Verifique su coneción de Internet.',
      verifyCredential: 'Verifique sus credenciales',
      error: 'Se presento un error, intenta de nuevo'
    }
  },
  shoppingHistory: {
    label: {
      title: 'Historial recargas'
    }
  },
  rechargePoints: {
    label: {
      title: 'Puntos de recarga'
    }
  },
  menu: {
    label: {
      waitingServices: 'Servicios en espera',
      changePassword: 'Modificar contraseña',
      shoppingHistory: 'Historial recargas',
      rechargePoints: 'Puntos de recarga',
      closeSession: 'Cerrar sesión',
      available: 'Disponible',
      occupied: 'Ocupado'
    }
  },
  permission: {
    require: 'Taxitura requiere permisos de ubicación.',
    cause: 'Debido a que se bloqueó la ventana de permisos el proceso debe ser manual',
    go: 'Ir a proceso manual',
    close: 'Cerrar'
  }
}
