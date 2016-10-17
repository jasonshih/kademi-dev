/*
 Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.stylesSet.add('myStyles',
    [
        // Block Styles
        { name: 'Muted text', element: 'p', attributes: { 'class': 'text-muted' } },
        { name: 'Primary text', element: 'p', attributes: { 'class': 'text-primary' } },
        { name: 'Success text', element: 'p', attributes: { 'class': 'text-success' } },
        { name: 'Info text', element: 'p', attributes: { 'class': 'text-info' } },
        { name: 'Warning text', element: 'p', attributes: { 'class': 'text-warning' } },
        { name: 'Danger text', element: 'p', attributes: { 'class': 'text-danger' } },

        {name: 'Primary background', element: 'p', attributes: {'class': 'bg-primary'}},
        {name: 'Success background', element: 'p', attributes: {'class': 'bg-success'}},
        {name: 'Info background', element: 'p', attributes: {'class': 'bg-info'}},
        {name: 'Warning background', element: 'p', attributes: {'class': 'bg-warning'}},
        {name: 'Danger background', element: 'p', attributes: {'class': 'bg-danger'}},

        { name: 'Code', element: 'pre', attributes: { 'class': 'prettyprint' } },
        { name: 'Lead paragraph', element: 'p', attributes: { 'class': 'lead' } },

        { name: 'Success alert', element: 'div', attributes: { 'class': 'alert alert-success' } },
        { name: 'Info alert', element: 'div', attributes: { 'class': 'alert alert-info' } },
        { name: 'Warning alert', element: 'div', attributes: { 'class': 'alert alert-warning' } },
        { name: 'Danger alert', element: 'div', attributes: { 'class': 'alert alert-danger' } },

        { name: 'Jumbotron', element: 'div', attributes: { 'class': 'jumbotron' } },
        { name: 'Page header', element: 'div', attributes: { 'class': 'page-header' } },

        // Inline Styles
        {name: 'Alternate heading', element: ["h1", "h2", "h3", "h4", "h5"], attributes: {'class': 'h-alternate'}},
        { name: 'Defalt label', element: 'span', attributes: { 'class': 'label label-default' } },
        { name: 'Primary label', element: 'span', attributes: { 'class': 'label label-primary' } },
        { name: 'Success label', element: 'span', attributes: { 'class': 'label label-success' } },
        { name: 'Info label', element: 'span', attributes: { 'class': 'label label-info' } },
        { name: 'Warning label', element: 'span', attributes: { 'class': 'label label-warning' } },
        { name: 'Danger label', element: 'span', attributes: { 'class': 'label label-danger' } },
        {name: 'Muted text', element: 'span', attributes: {'class': 'text-muted'}},
        {name: 'Primary text', element: 'span', attributes: {'class': 'text-primary'}},
        {name: 'Success text', element: 'span', attributes: {'class': 'text-success'}},
        {name: 'Info text', element: 'span', attributes: {'class': 'text-info'}},
        {name: 'Warning text', element: 'span', attributes: {'class': 'text-warning'}},
        {name: 'Danger text', element: 'span', attributes: {'class': 'text-danger'}},

        { name: 'Badge', element: 'span', attributes: { 'class': 'badge' } },

        // Object Styles
        { name: 'Striped table', element: 'table', attributes: { 'class': 'table table-striped' } },
        { name: 'Bordered table', element: 'table', attributes: { 'class': 'table table-bordered' } },
        { name: 'Unstyled list', element: 'ol', attributes: { 'class': 'list-unstyled' } },
        { name: 'Inline list', element: 'ol', attributes: { 'class': 'list-inline' } },

        { name: 'Responsive image', element: 'img', attributes: { 'class': 'img-responsive' } },
        { name: 'Rounded image', element: 'img', attributes: { 'class': 'img-rounded' } },
        { name: 'Circle image', element: 'img', attributes: { 'class': 'img-circle' } },
        { name: 'Thumbnail image', element: 'img', attributes: { 'class': 'img-thumbnail' } }
    ]);
