const fs = require('fs');
let app = fs.readFileSync('../src/app/App.tsx', 'utf8');

app = app.replace(
`  useEffect(() => {
    migrateLocalDataToMongo();
    const [session, setSession] = useState(getUserSession());
    useEffect(() => {
      const interval = setInterval(() => {
        const s = getUserSession();
        setSession(s);
        if (s) setUserLevel(s.level as UserLevel);
        else setUserLevel('Guest');
      }, 500);
      return () => clearInterval(interval);
    }, []);
    const old_session = getUserSession();
    if (old_session) {
      setUserLevel(old_session.level as UserLevel);
    }
  }, []);`,
`  useEffect(() => {
    migrateLocalDataToMongo();
    const interval = setInterval(() => {
      const s = getUserSession();
      if (s) setUserLevel(s.level as UserLevel);
      else setUserLevel('Guest');
    }, 1000);
    return () => clearInterval(interval);
  }, []);`
);

fs.writeFileSync('../src/app/App.tsx', app);
