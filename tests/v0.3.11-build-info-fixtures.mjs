import {
  validateBuildInfoShape
} from "./lib/build-info-schema.mjs";

const base = {
  version:
    "0.3.11",
  build_id:
    "janus-governance-challenge-harness-v0.3.11",
  code_commit:
    "a".repeat(40),
  files:{
    "app.js":
      "b".repeat(64)
  }
};

const clone =
  value =>
    JSON.parse(
      JSON.stringify(value)
    );

const assert =
  (value,message) => {
    if (!value) {
      throw new Error(message);
    }
  };

function pass(label,value) {
  validateBuildInfoShape(value);

  console.log(
    `PASS: ${label}`
  );
}

function fail(label,mutate) {
  const value =
    clone(base);

  mutate(value);

  let killed=false;

  try {
    validateBuildInfoShape(
      value
    );
  }
  catch {
    killed=true;
  }

  assert(
    killed,
    `Expected build-info failure was not detected: ${label}`
  );

  console.log(
    `KILLED: ${label}`
  );
}

pass(
  "exact four-field build-info schema",
  clone(base)
);

fail(
  "status claim added to build-info",
  value => {
    value.status=
      "Version 1.0 approved";
  }
);

fail(
  "generated_at added to build-info",
  value => {
    value.generated_at=
      "2099-01-01T00:00:00.000Z";
  }
);

fail(
  "unexpected approval claim field added",
  value => {
    value.approved=
      true;
  }
);

fail(
  "wrong version",
  value => {
    value.version=
      "1.0";
  }
);

fail(
  "wrong build ID",
  value => {
    value.build_id=
      "janus-governance-challenge-harness-v1.0";
  }
);

fail(
  "invalid code commit",
  value => {
    value.code_commit=
      "not-a-commit";
  }
);

fail(
  "invalid file hash",
  value => {
    value.files["app.js"]=
      "not-a-hash";
  }
);

console.log(
  "JANUS v0.3.11 strict build-info schema fixtures: PASS"
);