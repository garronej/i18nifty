---
description: Hook for changing the currently active language.
---

# useLang

```tsx
//This is the custom useLang, generated and exported by 
//you sin the src/i18n.tsx filed.
import { useLang } from "i18n";

function MyComponent(){

    const { lang, setLang } = useLang();
      
    return (
        <>
            <span>The app is currently in {(()=>{
                switch(lang){
                    case "en": return "English";
                    case "fr": return "French";
                }
            })()}</span>
            <button onClick={()=> setLang("en")}>Put the app in English</button>
            <button onClick={()=> setLang("fr")}>Put the app in French</button>
        </>
    );
    
}


```
