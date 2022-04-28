/* eslint-disable @typescript-eslint/no-empty-function */


import type { I18nDeclaration } from "./i18nDeclare";
import type { UnionToIntersection } from "./tools/UnionToIntersection";
import { createResolveLocalizedString } from "./LocalizedString";
import type { LocalizedString } from "./LocalizedString";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import type { StatefulEvt } from "evt";
import { Reflect } from "tsafe/Reflect";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
//import { id } from "tsafe/id";
//import { symToStr } from "tsafe/symToStr";


type WithOptionalKeys<Declaration> = { [ComponentName in keyof Declaration]: { [Key in keyof Declaration[ComponentName]]: Declaration[ComponentName][Key] | undefined; } };

export function createI18nApi<Declaration extends I18nDeclaration<any, any>>() {
	return function <Language extends string, FallbackLanguage extends Language>(
		params: {
			languages: readonly Language[];
			fallbackLanguage: FallbackLanguage;
		},
		translations: {
			[L in Language]:
			L extends FallbackLanguage ?
			UnionToIntersection<Declaration> :
			WithOptionalKeys<UnionToIntersection<Declaration>>
		}
	) {

		const { languages, fallbackLanguage } = params;

		const { useLng, propertyEvtLng } = (() => {

			const wrap = createUseGlobalState("lng", (): Language => {
				const iso2LanguageLike = navigator.language.split("-")[0].toLowerCase();

				const lng = languages.find(lng => lng.toLowerCase().includes(iso2LanguageLike));

				if (lng !== undefined) {
					return lng;
				}

				return fallbackLanguage;
			});

			const { useLng } = wrap;

			const propertyEvtLng = ["evtLng", { "get": () => wrap.evtLng }] as const;

			return { useLng, propertyEvtLng };

		})();


		function useResolveLocalizedString() {

			const { lng } = useLng();

			const { resolveLocalizedString } = useGuaranteedMemo(
				() => {

					const { resolveLocalizedString } = createResolveLocalizedString({
						"currentLanguage": lng,
						fallbackLanguage
					});

					return { resolveLocalizedString };

				},
				[lng]
			);

			return { resolveLocalizedString };

		}

		/*

type TFunction<S extends Scheme> = {
    (key: NoParamsKeys<S>): string;
    <T extends Exclude<keyof S, NoParamsKeys<S>>>(key: T, params: S[T]): string;
};

const useReactI18nextTranslation = id<{
    <K extends keyof Translations>(ns: K): { t: TFunction<I18nSchemes[K]> };
}>(reactI18next.useTranslation);

export function useTranslation<K extends keyof Translations>(
    nsOrNsAsKey: Record<K, unknown>,
): { t: TFunction<I18nSchemes[K]> } {
    return useReactI18nextTranslation(symToStr(nsOrNsAsKey));
}
*/


		function useTranslation<ComponentName extends keyof UnionToIntersection<Declaration>>(
			componentNameAsKey: Record<ComponentName, unknown>
		) {

			const { lng } = useLng();

			function t(key: keyof Declaration[ComponentName]) {


			}
		}

		return { t };

	}

	function resolveLocalizedString(localizedString: LocalizedString<Language>): string {
		return createResolveLocalizedString({
			"currentLanguage": propertyEvtLng[1].get().state,
			fallbackLanguage
		}).resolveLocalizedString(localizedString);
	}

	return Object.defineProperty({
		useLng,
		useTranslation,
		useResolveLocalizedString,
		resolveLocalizedString,
		"evtLng": Reflect<StatefulEvt<Language>>()
	}, ...propertyEvtLng);

}
}
