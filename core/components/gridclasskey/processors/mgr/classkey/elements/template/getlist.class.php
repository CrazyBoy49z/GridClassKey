<?php

/**
 * GridClassKey
 *
 * Copyright 2013 - 2017 by goldsky <goldsky@virtudraft.com>
 *
 * This file is part of GridClassKey, a custom class key for MODX
 * Revolution's Manager to hide child resources inside container's grid.
 *
 * GridClassKey is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation version 3,
 *
 * GridClassKey is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * GridClassKey; if not, write to the Free Software Foundation, Inc., 59 Temple Place,
 * Suite 330, Boston, MA 02111-1307 USA
 *
 * @package gridclasskey
 * @subpackage processor
 */

require_once MODX_CORE_PATH . 'model/modx/processors/element/template/getlist.class.php';

class GridTemplateGetListProcessor extends modTemplateGetListProcessor {

    public function beforeIteration(array $list) {
        if ($this->getProperty('combo',false)) {
            $empty = array(
                'id' => 0,
                'templatename' => $this->modx->lexicon('template_empty'),
                'description' => '',
                'editor_type' => 0,
                'icon' => '',
                'template_type' => 0,
                'content' => '',
                'locked' => false,
            );
            $empty['category_name'] = '';
            $list[] = $empty;
        }
        return $list;
    }

}

return 'GridTemplateGetListProcessor';
