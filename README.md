# Run Local

- ```pnpm install```

- ```pnpm start```

- Copy `src/environment/environment.example.ts` to `src/environment/environment.ts` and fill it
  
  ```export const environment = {
    production: false,
    graphCmsToken: "REPLACE_WITH_GRAPH_CMS_TOKEN",
    apiUrl: "REPLACE_WITH_HYGRAPH_API_URL"
    ```
}

# Deploy

```
    git checkout master
    git branch -D gh-pages
    git pull
    git add *
    git commit -m ""
    git push origin head
    git checkout -b gh-pages
    ng deploy --base-href=https://move-app.github.io/moveSports/ --no-silent
    git checkout master
    git branch -D gh-pages
```

# Y

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
