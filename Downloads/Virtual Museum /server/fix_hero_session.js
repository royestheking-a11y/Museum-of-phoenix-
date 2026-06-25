const fs = require('fs');

// Fix HeroLanding.tsx
let hero = fs.readFileSync('../src/app/components/HeroLanding.tsx', 'utf8');
hero = hero.replace(
  "  const session = getUserSession();",
  "  const [session, setSession] = useState(getUserSession());\n  useEffect(() => {\n    const interval = setInterval(() => setSession(getUserSession()), 500);\n    return () => clearInterval(interval);\n  }, []);"
);
fs.writeFileSync('../src/app/components/HeroLanding.tsx', hero);

// Fix App.tsx
let app = fs.readFileSync('../src/app/App.tsx', 'utf8');
app = app.replace(
  "const session = getUserSession();",
  "const [session, setSession] = useState(getUserSession());\n    useEffect(() => {\n      const interval = setInterval(() => {\n        const s = getUserSession();\n        setSession(s);\n        if (s) setUserLevel(s.level as UserLevel);\n        else setUserLevel('Guest');\n      }, 500);\n      return () => clearInterval(interval);\n    }, []);\n    const old_session = getUserSession();" // just to avoid breaking the existing useEffect
);
fs.writeFileSync('../src/app/App.tsx', app);
