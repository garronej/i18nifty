import { createI18nApi } from "i18nifty";

export const languages = ["en", "fr", "zh-CN"] as const;

export const fallbackLanguage = "en";

export type Language = typeof languages[number];

export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

export const { useTranslation, resolveLocalizedString, useLang, useResolveLocalizedString } = createI18nApi<
	typeof import("./App").i18n |
	typeof import("./pages/Home").i18n |
	typeof import("./pages/FourOhFour").i18n
>()(
	{
		languages,
		fallbackLanguage,
		"doPersistLanguageInLocalStorage": true
	},
	{
		"en": {
			"App": {
				"install": "Install",
				"paid for by French taxpayers": "Onyxia is free and open source software payed for by the french tax payers 🇫🇷",
				"pricing": "Pricing",
				"try it": "Try it",
				"it is libre software": "It is libre software",
				"ok": "Ok"
			},
			"Home": {
				"hero text": <>i18<g>nifty</g></>,
				"hero text subtext": "Type safe internationalization and translation in React",
				"subTitle": "Pool computing resources and provide a state of the art work environnement to your data scientists without relying on big tech closed-source software.",
				"what is onyxia title": "What's Onyxia?",
				"what is onyxia body":
					`Onyxia is a web app that installs on [Kubernetes](https://hubernetes.io) cluster.  
                It provides to your data scientist a nice and intuitive interface to launch on demand [containers](https://wwww.docker.com/) like [Spark, RStudio or Jupyter](https://datalab/sppcloud.fr/catalog) on demand.  
                On top of that Onyxia features a tight S3 integration via [MINIO](https://min.io/) or [AWS](https://aws.amazon.com/s3/) and [Vault](https://www.vaultproject.io) for managing sensitive information.`,
				"install now": "Install now",
			},
			"FourOhFour": {
				"not found": "Page not found",
			},
		},
		/* spell-checker: disable */
		"fr": {
			"App": {
				"install": "Installer",
				"paid for by French taxpayers": "Onyxia est un logiciel libre et gratuit firancer par le contribuable francais. 🇫🇷",
				"pricing": "Prix",
				"try it": "Demo",
				"it is libre software": "C'est un logiciel libre",
				"ok": "D'accord"
			},
			"Home": {
				"hero text": undefined,
				"hero text subtext": undefined,
				"subTitle": "Mettez en commun votre puissance de calcul et fournissez un environnement de travail a l'état de l'art à vos datascientits sans dépendre de logiciels propiétaires des GAFAM.",
				"what is onyxia title": "Qu'est-ce qu'Onyxia?",
				"what is onyxia body":
					`Onyxia est une application web qui s'installe sur un cluster [Kubernetes](https://kubernetes.io/).  
            Elle fournit à vos data scientistes une interface intuitive et agréable pour lancer des [containers](https://www.docker.com/) comme [Spark, RStudio ou Jupyter](https://datalab.sspcloud.fr/catalog/) à la demande
            et propose une intégration S3 ([MINIO](https://min.io/) ou [AWS](https://aws.amazon.com/s3/)) pour travailler avec la donnée et [Vault](https://www.vaultproject.io/) pour la géstion sécuisé des information sensibles.
            `,
				"install now": "Installer maintenant",
			},
			"FourOhFour": {
				"not found": "Page non trouvée",
			},
		},
		"zh-CN": {
			"App": {
				"install": undefined,
				"paid for by French taxpayers": undefined,
				"pricing": undefined,
				"try it": undefined,
				"it is libre software": undefined,
				"ok": undefined
			},
			"Home": {
				"hero text": undefined,
				"hero text subtext": undefined,
				"subTitle": undefined,
				"what is onyxia title": undefined,
				"what is onyxia body": undefined,
				"install now": undefined
			},
			"FourOhFour": {
				"not found": undefined
			},
		},
	}
	/* spell-checker: enable */
);





