import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  ICognitoUserPoolData,
  CognitoUserSession
} from 'amazon-cognito-identity-js';
import { User } from '../models/user';

const poolData: ICognitoUserPoolData = {
  UserPoolId: 'us-east-2_XaEF2vY8E',
  ClientId: '1ngeqfhjg237oi13qs729sbbih'
};
const userPool = new CognitoUserPool(poolData);


@Injectable()
export class AuthService {
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new Subject<boolean>();
  registeredUser: CognitoUser;

  constructor(private router: Router) {}
  signUp(username: string, email: string, password: string): void {
    this.authIsLoading.next(true);
    const user: User = {
      username: username,
      email: email,
      password: password
    };
    const emailAttribute = {
      Name: 'email',
      Value: user.email
    };
    const attrList: CognitoUserAttribute[] = [];
    attrList.push(new CognitoUserAttribute(emailAttribute));

    userPool.signUp(user.username, user.password, attrList, null, function(err, data){
        if (err) {
            this.authDidFail.next(true);
            this.authIsLoading.next(false);
            return;
        }
        this.authDidFail(false);
        this.authIsLoading.next(false);
        this.registeredUser = data.user;
        console.log(this.registeredUser);
    });
    return;
  }
  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    const userData = {
      Username: username,
      Pool: userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result)=>{
      if(err){
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        return;
      }
      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.router.navigate(['/']);
    });
  }

  signIn(username: string, password: string): void {
    this.authIsLoading.next(true);
    const authData = {
      Username: username,
      Password: password
    };
    var authDetails = new AuthenticationDetails(authData);
    var userData = {
      Username: username,
      Pool: userPool
    };
    var cognitoUser = new CognitoUser(userData);
    const that = this;
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: function(result: CognitoUserSession){
        that.authDidFail.next(false);
        that.authStatusChanged.next(true);
        that.authIsLoading.next(false);
        console.log(result);
      },
      onFailure: function(err){
        that.authDidFail.next(true);
        that.authIsLoading.next(false);
        console.log(err);
      }
    });

    this.authStatusChanged.next(true);
    return;
  }
  getAuthenticatedUser() {
    return userPool.getCurrentUser();
  }
  logout() {
    this.getAuthenticatedUser().signOut();
    this.authStatusChanged.next(false);
  }
  isAuthenticated(): Observable<boolean> {
    const user = this.getAuthenticatedUser();
    const obs = Observable.create((observer) => {
      if (!user) {
        observer.next(false);
      } else {
        user.getSession((err, session)=>{
          if(err){
            observer.next(false);
          }else{
            if(session.isValid()){
              observer.next(true);
            }else{
              observer.next(false);
            }
          }
        });
      }
      observer.complete();
    });
    return obs;
  }
  initAuth() {
    this.isAuthenticated().subscribe(
      (auth) => this.authStatusChanged.next(auth)
    );
  }
}