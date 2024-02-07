import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DetailPageComponent } from "./components/detail-page/detail-page.component";

const routes: Routes = [{ path: ':from/:to', component: DetailPageComponent }]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DetailRoutingModule { }