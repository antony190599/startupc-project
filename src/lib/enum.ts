
export enum ProjectStatus {
  CREATED = "created",
  PENDING_INTAKE = "pending_intake",
  APPROVED = "approved",
  REJECTED = "rejected",
  TECHNICAL_REVIEW = "technical_review",
  ACCEPTED = "accepted",
}

export enum ParentCategory {
  TECH = "tech",
  NO_TECH = "noTech",
}

export const parentCategories = {
  [ParentCategory.TECH]: "Tech",
  [ParentCategory.NO_TECH]: "No Tech",
};

export enum Industry {
  AMBIENTAL = "ambiental",
  AGRICULTURA = "agricultura",
  BIOTECNOLOGIA = "biotecnologia",
  COMUNICACIONES = "comunicaciones",
  COMIDA_BEBIDA = "comidaBebida",
  CONSTRUCCION = "construccion",
  CONSULTORIA = "consultoria",
  CUIDADO_SALUD = "cuidadoSalud",
  EDUCACION = "educacion",
  ELECTRONICA = "electronica",
  ENERGIA = "energia",
  ENTRETENIMIENTO = "entretenimiento",
  FINANCIERA = "financiera",
  INGENIERIA = "ingenieria",
  INDUMENTARIA = "indumentaria",
  LOGISTICA = "logistica",
  MANUFACTURA = "manufactura",
  QUIMICA = "quimica",
  RETAIL = "retail",
  TECNOLOGIA = "tecnologia",
  OTROS = "otros",
}

export const industries = {
  [Industry.AMBIENTAL]: "Ambiental",
  [Industry.AGRICULTURA]: "Agricultura",
  [Industry.BIOTECNOLOGIA]: "Biotecnología",
  [Industry.COMUNICACIONES]: "Comunicaciones",
  [Industry.COMIDA_BEBIDA]: "Comida y bebida",
  [Industry.CONSTRUCCION]: "Construcción",
  [Industry.CONSULTORIA]: "Consultoría",
  [Industry.CUIDADO_SALUD]: "Cuidado de la salud",
  [Industry.EDUCACION]: "Educación",
  [Industry.ELECTRONICA]: "Electrónica",
  [Industry.ENERGIA]: "Energía",
  [Industry.ENTRETENIMIENTO]: "Entretenimiento",
  [Industry.FINANCIERA]: "Financiera",
  [Industry.INGENIERIA]: "Ingeniería",
  [Industry.INDUMENTARIA]: "Indumentaria",
  [Industry.LOGISTICA]: "Logística",
  [Industry.MANUFACTURA]: "Manufactura",
  [Industry.QUIMICA]: "Química",
  [Industry.RETAIL]: "Retail",
  [Industry.TECNOLOGIA]: "Tecnología",
  [Industry.OTROS]: "Otros",
};

export enum Stage {
  IDEA_NEGOCIO = "ideaNegocio",
  MVP = "mvp",
}

export const stages = {
  [Stage.IDEA_NEGOCIO]: "Idea de negocio",
  [Stage.MVP]: "MVP (Prototipo mínimo viable)",
};

export enum ProjectOrigin {
  PROYECTO_CURSO = "proyectoCurso",
  PROYECTO_TESIS = "proyectoTesis",
  IDEA_EMPRENDIMIENTO = "ideaEmprendimiento",
  INQUBALAB = "inqubalab",
}

export const projectOrigins = {
  [ProjectOrigin.PROYECTO_CURSO]: "Proyecto de un curso",
  [ProjectOrigin.PROYECTO_TESIS]: "Proyecto de tesis",
  [ProjectOrigin.IDEA_EMPRENDIMIENTO]: "Idea de empredimiento",
  [ProjectOrigin.INQUBALAB]: "Inqubalab",
};

export enum University {
  UNMSM = "unmsm",
  PUC = "puc",
  ULIMA = "ulima",
  UP = "up",
  UDEP = "udep",
  UCH = "uch",
  UTEC = "utec",
  UPC = "upc",
  UNP = "unp",
  USIL = "usil",
  ESAN = "esan",
  CIBERTEC = "cibertec",
  OTRAS = "otras",
}

export const universities = {
  [University.UNMSM]: "Universidad Nacional Mayor de San Marcos",
  [University.PUC]: "Pontificia Universidad Católica del Perú",
  [University.ULIMA]: "Universidad de Lima",
  [University.UP]: "Universidad del Pacífico",
  [University.UDEP]: "Universidad de Piura",
  [University.UCH]: "Universidad Cayetano Heredia",
  [University.UTEC]: "Universidad de Ingeniería y Tecnología",
  [University.UPC]: "Universidad Peruana de Ciencias Aplicadas (Laureate)",
  [University.UNP]: "Universidad Privada del Norte (Laureate)",
  [University.USIL]: "Universidad San Ignacio de Loyola",
  [University.ESAN]: "Universidad ESAN",
  [University.CIBERTEC]: "Cibertec (Laureate)",
  [University.OTRAS]: "Otras",
};

export enum Source {
  REDES_SOCIALES = "redesSociales",
  AMIGOS = "amigos",
  FAMILIA = "familia",
  UNIVERSIDAD = "universidad",
  EVENTOS = "eventos",
  INTERNET = "internet",
  OTROS = "otros",
}

export const sources = {
  [Source.REDES_SOCIALES]: "Redes sociales",
  [Source.AMIGOS]: "Amigos",
  [Source.FAMILIA]: "Familia",
  [Source.UNIVERSIDAD]: "Universidad",
  [Source.EVENTOS]: "Eventos",
  [Source.INTERNET]: "Internet",
  [Source.OTROS]: "Otros",
};

export enum Sports {
  FUTBOL = "futbol",
  BALONCESTO = "baloncesto",
  NATACION = "natacion",
  VOLIBOL = "voleibol",
}

export const sports = {
  [Sports.FUTBOL]: "Fútbol",
  [Sports.BALONCESTO]: "Baloncesto",
  [Sports.NATACION]: "Natación",
  [Sports.VOLIBOL]: "Voleibol",
};

export enum Hobby {
  LECTURA = "lectura",
  MUSICA = "musica",
  VIDEOJUEGOS = "videojuegos",
  COCINAR = "cocinar",
  VIAJAR = "viajar",
  FOTOGRAFIA = "fotografia",
  PINTURA = "pintura",
  BAILAR = "bailar",
  ESCRIBIR = "escribir",
  OTRO = "otro",
}

export const hobbies = {
  [Hobby.LECTURA]: "Lectura",
  [Hobby.MUSICA]: "Música",
  [Hobby.VIDEOJUEGOS]: "Videojuegos",
  [Hobby.COCINAR]: "Cocinar",
  [Hobby.VIAJAR]: "Viajar",
  [Hobby.FOTOGRAFIA]: "Fotografía",
  [Hobby.PINTURA]: "Pintura",
  [Hobby.BAILAR]: "Bailar",
  [Hobby.ESCRIBIR]: "Escribir",
  [Hobby.OTRO]: "Otro",
};

export enum MovieGenre {
  ACCION = "accion",
  AVENTURA = "aventura",
  CIENCIA_FICCION = "cienciaFiccion",
  COMEDIA = "comedia",
  DRAMA = "drama",
  FANTASIA = "fantasia",
  SUSPENSE = "suspense",
  TERROR = "terror",
}

export const movieGenres = {
  [MovieGenre.ACCION]: "Acción",
  [MovieGenre.AVENTURA]: "Aventura",
  [MovieGenre.CIENCIA_FICCION]: "Ciencia ficción",
  [MovieGenre.COMEDIA]: "Comedia",
  [MovieGenre.DRAMA]: "Drama",
  [MovieGenre.FANTASIA]: "Fantasía",
  [MovieGenre.SUSPENSE]: "Suspense",
  [MovieGenre.TERROR]: "Terror",
};

export enum ProgramTypes {
  INQUBALAB = "inqubalab",
  IDEA_FEEDBACK = "idea-feedback",
  ACELERACION = "aceleracion",
}

export const programTypes = [
  {
    id: ProgramTypes.INQUBALAB,
    title: "Inqubalab",
    description: "Programa de incubación para ideas de negocio",
    icon: "🚀",
  },
  {
    id: ProgramTypes.IDEA_FEEDBACK,
    title: "Idea Feedback",
    description: "Programa de retroalimentación para ideas",
    icon: "💡",
  },
  {
    id: ProgramTypes.ACELERACION,
    title: "Aceleración",
    description: "Programa de aceleración para startups",
    icon: "⚡",
  },
];

export enum StepProject {
  PROGRAM_SELECTION = "program-selection",
  GENERAL_DATA = "general-data",
  IMPACT_ORIGIN = "impact-origin",
  PRESENTATION = "presentation",
  TEAM = "team",
  PREFERENCES = "preferences",
  CONSENT = "consent",
}

export const steps = [
  {
    id: StepProject.PROGRAM_SELECTION,
    title: "Selección de Programa",
    description: "Elija el programa que desea",
  },
  {
    id: StepProject.GENERAL_DATA,
    title: "Datos Generales",
    description: "Información básica del proyecto",
  },
  {
    id: StepProject.IMPACT_ORIGIN,
    title: "Impacto y Origen",
    description: "Valor y origen del proyecto",
  },
  {
    id: StepProject.PRESENTATION,
    title: "Presentación",
    description: "Video de presentación",
  },
  {
    id: StepProject.TEAM,
    title: "Equipo",
    description: "Integrantes del proyecto",
  },
  {
    id: StepProject.PREFERENCES,
    title: "Preferencias",
    description: "Gustos personales",
  },
  {
    id: StepProject.CONSENT,
    title: "Consentimiento",
    description: "Aceptación de términos",
  },
];
